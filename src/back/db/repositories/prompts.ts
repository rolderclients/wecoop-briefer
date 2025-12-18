import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import sanitizeHtml from 'sanitize-html';
import { eq, surql } from 'surrealdb';
import type {
	CreatePrompt,
	Prompt,
	ServiceWithPrompts,
	UpdatePrompt,
} from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getServicesWithPromptsFn = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

		const [result] = await db
			.query(surql`SELECT
            id,
            title,
            (
                SELECT *, model.{ id, name, title }
                FROM id.prompts
                WHERE ${eq('archived', archived)}
                ORDER BY title NUMERIC
            ) AS prompts
        FROM service
        WHERE count(prompts[WHERE ${eq('archived', archived)}]) > 0 AND archived == false
        ORDER BY title NUMERIC;`)
			.json()
			.collect<[ServiceWithPrompts[]]>();

		return result;
	});

export const servicesWithPromptsQueryOptions = (archived: boolean) =>
	queryOptions<ServiceWithPrompts[]>({
		queryKey: ['servicesWithPrompts', archived],
		queryFn: () => getServicesWithPromptsFn({ data: { archived } }),
	});

const getServicesWithEnbledPromptsFn = createServerFn({
	method: 'GET',
}).handler(async () => {
	const db = await getDB();

	const [result] = await db
		.query(surql`SELECT
            id,
            title,
            (
                SELECT *, model.{ id, name, title }
                FROM id.prompts
                WHERE enabled
                ORDER BY title NUMERIC
            ) AS prompts
        FROM service
        WHERE count(prompts[WHERE enabled]) > 0 AND archived == false
        ORDER BY title NUMERIC;`)
		.json()
		.collect<[ServiceWithPrompts[]]>();

	return result;
});

export const servicesWithEnbledPromptsQueryOptions = () =>
	queryOptions<ServiceWithPrompts[]>({
		queryKey: ['servicesWithEnbledPrompts'],
		queryFn: () => getServicesWithEnbledPromptsFn(),
	});

const getPromptWithModelFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const id = await fromDTO(data);
		const [result] = await db
			.query(surql`SELECT *, model.{ id, name, title } FROM ONLY ${id}`)
			.json()
			.collect<[Prompt]>();

		return result;
	});

export const promptQueryOptions = (promptId: string) =>
	queryOptions<Prompt>({
		queryKey: ['prompt', promptId],
		queryFn: () => getPromptWithModelFn({ data: promptId }),
	});

export const createPromptFn = createServerFn({ method: 'POST' })
	.inputValidator((data: CreatePrompt) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const content = await fromDTO(data);
		await db.query(surql`CREATE prompt CONTENT ${content}`);
	});

export const updatePromptFn = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdatePrompt) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		if (data.content) data.content = sanitizeHtml(data.content);
		const item = await fromDTO(data);
		await db.update(item.id).merge(item);
	});

export const updatePromptsFn = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdatePrompt[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const items = await fromDTOs(data);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deletePromptsFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
