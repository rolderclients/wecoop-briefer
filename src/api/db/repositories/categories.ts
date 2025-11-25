import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import type { Category, CreateCategory } from '@/app';
// import { authMiddleware } from '@/app/auth/middleware';
import { getDB } from '..';

const getCategoriesFn = createServerFn({ method: 'GET' })
	// .middleware([authMiddleware])
	.handler(async () => {
		const db = await getDB();

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

export const createCategoryFn = createServerFn({ method: 'POST' })
	// .middleware([authMiddleware])
	.inputValidator((data: CreateCategory) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		await db.query(surql`CREATE category CONTENT ${data};`);
	});
