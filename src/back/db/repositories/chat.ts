import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import type { AddChatMessage } from '@/types';
import { getDB } from '..';
import { fromDTO } from '../utils';

export const addChatMessageFn = createServerFn({ method: 'POST' })
	.inputValidator((data: AddChatMessage) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const item = await fromDTO(data);
		await db.query(surql`UPDATE ${item.id} SET messages += ${item.message};`);
	});
