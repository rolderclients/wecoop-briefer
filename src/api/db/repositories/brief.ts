import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { getDbSession } from '../session';
import type { UpdateBrief } from '../types';
import { fromDTO } from '../utils';

export const updateBrief = createServerFn({ method: 'POST' })
	.inputValidator((data: { briefData: UpdateBrief }) => data)
	.handler(async ({ data: { briefData } }) => {
		const db = await getDbSession();

		const item = await fromDTO(briefData);
		await db.query(surql`UPDATE ${item.id} MERGE ${item};`);
	});
