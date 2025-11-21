import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { authMiddleware } from '@/app';
import { getDB } from '..';
import type { Model } from '../types';

const getModelsFn = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.handler(async () => {
		const db = await getDB();

		const [result] = await db
			.query(surql`SELECT * FROM model ORDER BY title NUMERIC;`)
			.json()
			.collect<[Model[]]>();

		return result;
	});

export const modelsQueryOptions = () =>
	queryOptions<Model[]>({
		queryKey: ['models'],
		queryFn: getModelsFn,
	});
