import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import type { CreateComment } from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

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
