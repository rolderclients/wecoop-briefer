import {
	type CleanedWhere,
	createAdapterFactory,
	type DBAdapterDebugLogOption,
} from 'better-auth/adapters';
import { APIError } from 'better-auth/api';
import type { DBFieldAttribute, DBFieldType } from 'better-auth/db';
import {
	type ConnectOptions,
	type Engines,
	escapeIdent,
	RecordId,
	type RecordIdValue,
	Surreal,
	surql,
	Table,
} from 'surrealdb';
import type {
	AdapterContext,
	AdapterRequestParams,
	CreateParams,
	DeleteParams,
	FindManyParams,
	FindOneParams,
	UpdateManyParams,
	UpdateParams,
} from './types';

interface SurrealAdapterOptions extends ConnectOptions {
	engines?: Engines;
	endpoint: string;
	debugLogs?: DBAdapterDebugLogOption;
	usePlural?: boolean;
}

export function surrealAdapter(options?: SurrealAdapterOptions) {
	const { engines, endpoint, debugLogs, usePlural, ...connectOptions } =
		options || {};

	const surreal = new Surreal(engines ? { engines } : undefined);

	if (!endpoint) {
		throw new Error('SurrealDB endpoint is required');
	}

	const ensureConnection = async () => {
		if (surreal.status === 'disconnected') {
			await surreal.connect(endpoint, connectOptions);
		}

		return surreal;
	};

	return createAdapterFactory({
		config: {
			adapterId: 'surrealdb',
			debugLogs,
			usePlural,
			supportsBooleans: true,
			supportsDates: true,
			supportsJSON: true,
			supportsNumericIds: false,
			customTransformOutput: (props) => {
				if (props.field === 'id') {
					return props.data
						.replace(`${escapeIdent(props.model)}:`, '')
						.replace(/(^⟨|⟩$)/g, '')
						.replace(/\\⟩$/, '⟩');
				}

				if (props.fieldAttributes?.references) {
					return props.data
						.replace(
							`${escapeIdent(props.fieldAttributes?.references?.model)}:`,
							'',
						)
						.replace(/(^⟨|⟩$)/g, '')
						.replace(/\\⟩$/, '⟩');
				}

				return props.data;
			},
		},
		adapter: (context) => ({
			count: async ({ model, where }) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'count',
						model,
						where,
					},
					context,
				);
				const [result] = await db.query(query).json().collect<number[]>();
				return result || 0;
			},
			findOne: async <T>({
				model,
				where,
				select,
			}: Omit<FindOneParams, 'method' | 'context'>) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'findOne',
						model,
						where,
						select,
					},
					context,
				);
				const [[result] = []] = await db.query(query).json().collect<T[][]>();
				return (result as T) || null;
			},
			findMany: async <T>({
				model,
				where,
				limit,
				sortBy,
				offset,
			}: Omit<FindManyParams, 'method'>) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'findMany',
						model,
						where,
						limit,
						sortBy,
						offset,
					},
					context,
				);

				const [result] = await db.query(query).json().collect<T[][]>();
				return (result as T) || [];
			},
			create: async <T extends Record<string, unknown>>({
				data,
				model,
				select,
			}: Omit<CreateParams<T>, 'method'>) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'create',
						model,
						data,
						select,
					},
					context,
				);
				const [[result] = []] = await db.query(query).json().collect<T[][]>();
				if (!result) {
					throw new Error('Failed to create record');
				}
				return result as T;
			},
			update: async <T>({
				model,
				where,
				update,
			}: Omit<UpdateParams<T>, 'method'>) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'update',
						model,
						where,
						update,
					},
					context,
				);
				const [[result] = []] = await db.query(query).json().collect<T[][]>();
				return (result as T) || null;
			},
			updateMany: async ({
				model,
				where,
				update,
			}: Omit<UpdateManyParams, 'method'>) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'updateMany',
						model,
						where,
						update,
					},
					context,
				);
				const [result] = await db.query(query).json().collect<number[]>();
				return result || 0;
			},
			delete: async <T>({ model, where }: Omit<DeleteParams, 'method'>) => {
				const db = await ensureConnection();
				const query = generateSurrealQL<T>(
					{
						method: 'delete',
						model,
						where,
					},
					context,
				);
				await db.query<T[][]>(query);
			},
			deleteMany: async ({ model, where }) => {
				const db = await ensureConnection();
				const query = generateSurrealQL(
					{
						method: 'deleteMany',
						model,
						where,
					},
					context,
				);
				const [result] = await db.query(query).json().collect<number[]>();
				return result || 0;
			},
			createSchema: async ({ tables, file }) => {
				const code = [] as string[];

				for (const tableKey in tables) {
					const table = tables[tableKey];
					if (!table) continue;

					code.push(`DEFINE TABLE ${escapeIdent(table.modelName)} SCHEMALESS;`);

					for (const fieldKey in table.fields) {
						const field = table.fields[fieldKey];
						if (!field) continue;

						const fieldName = field.fieldName || fieldKey;

						if (Array.isArray(field.type)) {
							throw new Error(
								`Array type not supported: ${JSON.stringify(field.type)}`,
							);
						}

						let type = (
							{
								string: 'string',
								number: 'number',
								boolean: 'bool',
								date: 'datetime',
								'number[]': 'array<number>',
								'string[]': 'array<string>',
							} as Record<typeof field.type & string, string>
						)[field.type];

						if (field.references) {
							type = `record<${escapeIdent(field.references.model)}>`;
						}

						if (!field.required) {
							type = `option<${escapeIdent(type)}>`;
						}

						code.push(
							`DEFINE FIELD ${escapeIdent(fieldName)} ON TABLE ${escapeIdent(table.modelName)} TYPE ${type};`,
						);

						if (field.unique) {
							code.push(
								`DEFINE INDEX ${escapeIdent(joinCamelCase([table.modelName, table.modelName, 'unique']))} ON TABLE ${escapeIdent(table.modelName)} COLUMNS ${escapeIdent(fieldName)} UNIQUE;`,
							);
						}
					}

					code.push(``);
				}

				return {
					code: code.join('\n'),
					path: file || './better-auth-schema.surql',
				};
			},
		}),
	});
}

export function generateSurrealQL<T>(
	request: AdapterRequestParams<T>,
	context: AdapterContext,
) {
	const query = surql``;
	const where = [] as CleanedWhere[];
	const ids = [] as RecordId[];

	if ('where' in request && request.where) {
		for (const condition of request.where) {
			const value = condition.value;
			if (condition.field === 'id') {
				if (condition.operator === 'in' && Array.isArray(value)) {
					for (const id of value) {
						ids.push(new RecordId(request.model, id));
					}
					continue;
				} else if (condition.operator === 'not_in' && Array.isArray(value)) {
					where.push(condition);
					continue;
				} else if (
					condition.operator !== 'starts_with' &&
					condition.operator !== 'ends_with' &&
					condition.operator !== 'contains' &&
					condition.operator !== 'not_in'
				) {
					ids.push(new RecordId(request.model, value as string));
					continue;
				}
			}

			where.push(condition);
		}
	}

	const model = ids.length > 0 ? ids : new Table(request.model);
	if (request.method === 'create') {
		query.append`CREATE ${model} SET `;

		const data = request.data as Record<string, unknown>;
		const dataKeys = Object.keys(data);
		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[i] || '';
			const field = context.getFieldName({
				model: request.model,
				field: key,
			});

			// we ignore unknown fields
			if (!field) continue;

			const attributes = context.getFieldAttributes({
				model: request.model,
				field: key,
			});
			const value = request.data[key];

			if (i > 0) {
				//@ts-expect-error
				query.append([`, `]);
			}

			if (attributes?.references) {
				query.append(
					//@ts-expect-error
					[`${escapeIdent(field)} = `],
					new RecordId(attributes.references.model, value as string),
				);
			} else {
				//@ts-expect-error
				query.append([`${escapeIdent(field)} = `], value);
			}
		}
	} else if (request.method === 'delete' || request.method === 'deleteMany') {
		if (request.method === 'deleteMany') {
			query.append`RETURN (DELETE ${model}`;
		} else if (request.method === 'delete') {
			query.append`DELETE ${model}`;
		}
	} else if (request.method === 'update' || request.method === 'updateMany') {
		if (request.method === 'updateMany') {
			query.append`RETURN (UPDATE ${model} SET `;
		} else {
			query.append`UPDATE ${model} SET `;
		}

		const data = request.update as Record<string, unknown>;
		const dataKeys = Object.keys(data);
		for (let i = 0; i < dataKeys.length; i++) {
			const key = dataKeys[i] || '';
			const field = context.getFieldName({
				model: request.model,
				field: key,
			});
			const value = data[key];
			if (i > 0) {
				//@ts-expect-error
				query.append([`, `]);
			}
			//@ts-expect-error
			query.append([`${escapeIdent(field)} = `], value);
		}
	} else if ('select' in request && request.select) {
		//@ts-expect-error
		query.append([
			`SELECT ${request.select.map(escapeIdent).join(', ') || '*'} FROM `,
			model as unknown as string,
		]);
	} else if (request.method === 'count') {
		query.append`RETURN (SELECT count() FROM ${model}`;
	} else {
		query.append`SELECT * FROM ${model}`;
	}

	if (where.length > 0) {
		query.append` WHERE `;
		let first = true;
		for (const condition of where) {
			const field = condition.field;
			const attributes = context.getFieldAttributes({
				model: request.model,
				field,
			});
			let value = condition.value;

			// Специальная обработка для поля id с операторами in/not_in
			if (
				field === 'id' &&
				(condition.operator === 'in' || condition.operator === 'not_in') &&
				Array.isArray(value)
			) {
				//@ts-expect-error
				value = value.map((id) => new RecordId(request.model, id));
			} else {
				//@ts-expect-error
				value = surrealizeValue(value, attributes);
			}

			if (first) {
				first = false;
			} else {
				//@ts-expect-error
				query.append([` ${condition.connector} `]);
			}

			switch (condition.operator) {
				case 'eq':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} = `], value);
					break;
				case 'ne':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} != `], value);
					break;
				case 'gt':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} > `], value);
					break;
				case 'gte':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} >= `], value);
					break;
				case 'lt':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} < `], value);
					break;
				case 'lte':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} <= `], value);
					break;
				case 'in':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} IN `], value);
					break;
				case 'not_in':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} NOT IN `], value);
					break;
				case 'starts_with':
					query.append(
						//@ts-expect-error
						[`string::starts_with(${escapeIdent(field)}, `, ')'],
						value,
					);
					break;
				case 'ends_with':
					query.append(
						//@ts-expect-error
						[`string::ends_with(${escapeIdent(field)}, `, ')'],
						value,
					);
					break;
				case 'contains':
					//@ts-expect-error
					query.append([`${escapeIdent(field)} CONTAINS `], value);
					break;
				default:
					throw new APIError(`Unsupported operator: ${condition.operator}`);
			}
		}
	}

	if ('sortBy' in request && request.sortBy) {
		const field = context.getFieldName({
			model: request.model,
			field: request.sortBy.field,
		});
		//@ts-expect-error
		query.append([
			` ORDER BY ${escapeIdent(field)} ${request.sortBy.direction === 'asc' ? 'ASC' : 'DESC'}`,
		]);
	}

	if ('limit' in request && request.limit) {
		query.append` LIMIT ${request.limit}`;
	}

	if ('offset' in request && request.offset) {
		query.append` START ${request.offset}`;
	}

	if (request.method === 'count') {
		query.append` GROUP ALL).count`;
	} else if (
		request.method === 'deleteMany' ||
		request.method === 'updateMany'
	) {
		query.append` RETURN true).len()`;
	}

	return query;
}

function joinCamelCase(parts: string[]) {
	let result = parts[0] || '';

	for (const part of parts.slice(1)) {
		result += part.charAt(0).toUpperCase() + part.slice(1);
	}

	return result;
}

function surrealizeValue(value: unknown, field: DBFieldAttribute<DBFieldType>) {
	// Primitives are already surrealizable, just need to convert simple id values
	// to RecordIds

	// console.log(value, field);
	if (field?.references) {
		return new RecordId(field.references.model, value as RecordIdValue);
	}

	return value;
}
