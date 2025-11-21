import type {
	AdapterFactoryCustomizeAdapterCreator,
	CleanedWhere,
} from 'better-auth/adapters';

export type CountParams = {
	method: 'count';
	model: string;
	where?: CleanedWhere[];
};

export type FindOneParams = {
	method: 'findOne';
	model: string;
	where: CleanedWhere[];
	select?: string[];
};

export type FindManyParams = {
	method: 'findMany';
	model: string;
	where?: CleanedWhere[];
	limit: number;
	sortBy?: {
		field: string;
		direction: 'asc' | 'desc';
	};
	offset?: number;
};

export type CreateParams<
	T extends Record<string, unknown> = Record<string, unknown>,
> = {
	method: 'create';
	model: string;
	data: T;
	select?: string[];
};

export type UpdateParams<T> = {
	method: 'update';
	model: string;
	where: CleanedWhere[];
	update: T;
};

export type UpdateManyParams = {
	method: 'updateMany';
	model: string;
	where: CleanedWhere[];
	update: unknown;
};

export type DeleteParams = {
	method: 'delete';
	model: string;
	where: CleanedWhere[];
};

export type DeleteManyParams = {
	method: 'deleteMany';
	model: string;
	where: CleanedWhere[];
};

export type AdapterRequestParams<T> =
	| CountParams
	| FindOneParams
	| FindManyParams
	| CreateParams<T & Record<string, unknown>>
	| UpdateParams<T>
	| UpdateManyParams
	| DeleteParams
	| DeleteManyParams;

export type AdapterContext =
	Parameters<AdapterFactoryCustomizeAdapterCreator>[0];
