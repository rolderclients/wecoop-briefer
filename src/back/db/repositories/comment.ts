import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import type { CreateComment } from '@/types';
import { getDB } from '..';
import { fromDTO } from '../utils';

export const createCommentFn = createServerFn({ method: 'POST' })
	.inputValidator((data: CreateComment) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const content = await fromDTO(data);
		await db.query(surql`CREATE comment CONTENT ${content};`);
	});
