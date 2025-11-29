import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import type { Category, CreateCategory, UpdateCategory } from '@/types';
import { getDB } from '..';
import { fromDTO } from '../utils';

const getCategoriesFn = createServerFn({ method: 'GET' }).handler(async () => {
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
	.inputValidator((data: CreateCategory) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		await db.query(surql`CREATE category CONTENT ${data};`);
	});

export const updateCategoryFn = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdateCategory) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const item = await fromDTO(data);
		await db.update(item.id).merge(item);
	});
