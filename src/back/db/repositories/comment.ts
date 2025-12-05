import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import type { Comment, CreateComment } from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getCommentsFn = createServerFn({ method: 'GET' })
	.inputValidator((data: { task: string }) => data)
	.handler(async ({ data: { task } }) => {
		const db = await getDB();

		console.log('tasktasktask', task);

		const [result] = await db
			.query(surql`SELECT *
        FROM comment
WHERE ${eq('task', task)}
        ORDER BY time.created
      `) // WHERE ${eq('task', task)} WHERE task=task:1n8cdtl4hwrah6y3i4xd
			.json()
			.collect<[Comment[]]>();

		return result;
	});

export const commentsQueryOptions = (data: { task: string }) =>
	queryOptions<Comment[]>({
		queryKey: ['comments', data.task],
		queryFn: () => getCommentsFn({ data }),
	});

export const createCommentFn = createServerFn({ method: 'POST' })
	.inputValidator((data: CreateComment) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const content = await fromDTO(data);
		await db.query(surql`CREATE task CONTENT ${content};`);
	});

export const deleteCommentsFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
