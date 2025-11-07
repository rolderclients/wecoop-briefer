import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { fromDTO, getDB } from '../db';
import type { UpdateBrief } from '../types';

export const updateBrief = createServerFn({ method: 'POST' })
	.inputValidator((data: { briefData: UpdateBrief }) => data)
	.handler(async ({ data: { briefData } }) => {
		const db = await getDB();

		const item = await fromDTO(briefData);
		await db.query(surql`UPDATE ${item.id} MERGE ${item};`);
	});
