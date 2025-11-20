import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import sanitizeHtml from 'sanitize-html';
import { eq, surql } from 'surrealdb';
import { authMiddleware } from '@/app';
import { getDBFn } from '../connection';
import type {
	NewPrompt,
	Prompt,
	ServiceWithPrompts,
	UpdatePrompt,
} from '../types';
import { fromDTO, fromDTOs } from '../utils';

const getServicesWithPromptsFn = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDBFn();

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
		queryFn: () => getServicesWithPromptsFn({ data: { archived } }),
	});

export const getPromptFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { promptId: string }) => data)
	.handler(async ({ data: { promptId } }) => {
		const db = await getDBFn();

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
		queryFn: () => getPromptFn({ data: { promptId } }),
	});

export const createPromptFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { promptData: NewPrompt }) => data)
	.handler(async ({ data: { promptData } }) => {
		const db = await getDBFn();

		const data = await fromDTO(promptData);
		await db.query(surql`CREATE prompt CONTENT ${data}`);
	});

export const updatePromptFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { promptData: UpdatePrompt }) => data)
	.handler(async ({ data: { promptData } }) => {
		const db = await getDBFn();

		if (promptData.content)
			promptData.content = sanitizeHtml(promptData.content);
		const item = await fromDTO(promptData);
		await db.update(item.id).merge(item);
	});

export const updatePromptsFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { promptsData: UpdatePrompt[] }) => data)
	.handler(async ({ data: { promptsData } }) => {
		const db = await getDBFn();

		const items = await fromDTOs(promptsData);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deletePromptsFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { ids: string[] }) => data)
	.handler(async ({ data }) => {
		const db = await getDBFn();

		const ids = await fromDTOs(data.ids);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
