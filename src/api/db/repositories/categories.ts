import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { getDB } from '../connection';
import type { Category } from '../types';

const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
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
		queryFn: getCategories,
	});
