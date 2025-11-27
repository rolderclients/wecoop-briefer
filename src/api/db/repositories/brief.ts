import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import type { UpdateBrief } from '@/app';
import { getDB } from '..';
import { fromDTO } from '../utils';

export const updateBrief = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdateBrief) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const item = await fromDTO(data);
		await db.query(surql`UPDATE ${item.id} MERGE ${item};`);
	});
