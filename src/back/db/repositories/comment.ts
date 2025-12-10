import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import type { Comment, CreateComment } from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getCommentsFn = createServerFn({ method: 'GET' })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const taskId = await fromDTO(data);

		const [result] = await db
			.query(surql`SELECT *
				FROM comment
				WHERE ${eq('task', taskId)}
				ORDER BY time.created`)
			.json()
			.collect<[Comment[]]>();

		return result;
	});

export const commentsQueryOptions = (taskId: string) =>
	queryOptions<Comment[]>({
		queryKey: ['comments', taskId],
		queryFn: () => getCommentsFn({ data: taskId }),
	});

export const createCommentFn = createServerFn({ method: 'POST' })
	.inputValidator((data: CreateComment) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const content = await fromDTO(data);
		await db.query(surql`CREATE comment CONTENT ${content};`);
	});

export const deleteCommentsFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
