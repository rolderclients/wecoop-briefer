import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import type { CreateFile, File } from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getFilesFn = createServerFn({ method: 'GET' })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const taskId = await fromDTO(data);
		const [result] = await db
			.query(surql`SELECT *
        FROM file
        WHERE ${eq('task', taskId)}
        ORDER BY time.updated DESC;`)
			.json()
			.collect<[File[]]>();

		return result;
	});

export const filesQueryOptions = (taskId: string) =>
	queryOptions<File[]>({
		queryKey: ['files', taskId],
		queryFn: () => getFilesFn({ data: taskId }),
	});

export const createFilesFn = createServerFn({ method: 'POST' })
	.inputValidator((data: CreateFile[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const items = await fromDTO(data);
		await db.query(surql`FOR $item IN ${items} { CREATE file CONTENT $item };`);
	});

export const deleteFilesFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
