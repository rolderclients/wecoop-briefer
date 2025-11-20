import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { authMiddleware } from '@/app';
import { getDBFn } from '../connection';
import type { Category } from '../types';

const getCategoriesFn = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.handler(async () => {
		const db = await getDBFn();

		const [result] = await db
			.query(surql`SELECT * FROM category ORDER BY title NUMERIC;`)
			.json()
			.collect<[Category[]]>();

		return result;
	});

export const categoriesQueryOptions = () =>
	queryOptions<Category[]>({
		queryKey: ['categories'],
		queryFn: getCategoriesFn,
	});
