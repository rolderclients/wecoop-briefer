import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import sanitizeHtml from 'sanitize-html';
import { eq, surql } from 'surrealdb';
import { getDbSession } from '../session';
import type {
	NewPrompt,
	Prompt,
	ServiceWithPrompts,
	UpdatePrompt,
} from '../types';
import { fromDTO, fromDTOs } from '../utils';

const getServicesWithPrompts = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDbSession();

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

export const servicesWithPromptsQueryOptions = (archived?: boolean) =>
	queryOptions<ServiceWithPrompts[]>({
		queryKey: ['servicesWithPrompts', !!archived],
		queryFn: () => getServicesWithPrompts({ data: { archived } }),
	});

export const getPrompt = createServerFn({ method: 'POST' })
	.inputValidator((data: { promptId: string }) => data)
	.handler(async ({ data: { promptId } }) => {
		const db = await getDbSession();

		const id = await fromDTO(promptId);
		const [result] = await db
			.query(surql`SELECT *, model.{ id, name, title } FROM ONLY ${id}`)
			.json()
			.collect<[Prompt]>();

		return result;
	});

export const promptQueryOptions = (promptId: string) =>
	queryOptions<Prompt>({
		queryKey: ['prompt'],
		queryFn: () => getPrompt({ data: { promptId } }),
	});

export const createPrompt = createServerFn({ method: 'POST' })
	.inputValidator((data: { promptData: NewPrompt }) => data)
	.handler(async ({ data: { promptData } }) => {
		const db = await getDbSession();

		const data = await fromDTO(promptData);
		await db.query(surql`CREATE prompt CONTENT ${data}`);
	});

export const updatePrompt = createServerFn({ method: 'POST' })
	.inputValidator((data: { promptData: UpdatePrompt }) => data)
	.handler(async ({ data: { promptData } }) => {
		const db = await getDbSession();

		if (promptData.content)
			promptData.content = sanitizeHtml(promptData.content);
		const item = await fromDTO(promptData);
		await db.update(item.id).merge(item);
	});

export const updatePrompts = createServerFn({ method: 'POST' })
	.inputValidator((data: { promptsData: UpdatePrompt[] }) => data)
	.handler(async ({ data: { promptsData } }) => {
		const db = await getDbSession();

		const items = await fromDTOs(promptsData);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deletePrompts = createServerFn({ method: 'POST' })
	.inputValidator((data: { ids: string[] }) => data)
	.handler(async ({ data }) => {
		const db = await getDbSession();

		const ids = await fromDTOs(data.ids);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
