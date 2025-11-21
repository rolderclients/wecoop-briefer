import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { authMiddleware } from '@/app';
import { getDB } from '..';
import type { UpdateBrief } from '../types';
import { fromDTO } from '../utils';

export const updateBriefFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { briefData: UpdateBrief }) => data)
	.handler(async ({ data: { briefData } }) => {
		const db = await getDB();

		const item = await fromDTO(briefData);
		await db.query(surql`UPDATE ${item.id} MERGE ${item};`);
	});
