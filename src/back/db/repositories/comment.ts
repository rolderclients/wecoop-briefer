import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, RecordId, surql } from 'surrealdb';
import type { Comment, CreateComment } from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getCommentsFn = createServerFn({ method: 'GET' })
	.inputValidator((data: { task: string }) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		// Преобразуем строку в Record ID
		const task = data.task.includes(':')
			? new RecordId('task', data.task.split(':')[1]) // Не достаточно просто подаствить task:12w21e1e12 в eq('task', task)
			: data.task;
		console.log('data.task:', data.task);
		console.log('task:', task);

		const [result] = await db
			.query(surql`SELECT *
				FROM comment
				WHERE ${eq('task', task)}
				ORDER BY time.created`)
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
