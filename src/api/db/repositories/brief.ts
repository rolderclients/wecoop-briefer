import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { getDB } from '../connection';
import type { UpdateBrief } from '../types';
import { fromDTO } from '../utils';

export const updateBrief = createServerFn({ method: 'POST' })
	.inputValidator((data: { briefData: UpdateBrief }) => data)
	.handler(async ({ data: { briefData } }) => {
		const db = await getDB();

		const item = await fromDTO(briefData);
		await db.query(surql`UPDATE ${item.id} MERGE ${item};`);
	});
