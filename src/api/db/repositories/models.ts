import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { surql } from 'surrealdb';
import { getDbSession } from '../session';
import type { Model } from '../types';

const getModels = createServerFn({ method: 'GET' }).handler(async () => {
	const db = await getDbSession();

	const [result] = await db
		.query(surql`SELECT * FROM model ORDER BY title NUMERIC;`)
		.json()
		.collect<[Model[]]>();

	return result;
});

export const modelsQueryOptions = () =>
	queryOptions<Model[]>({
		queryKey: ['models'],
		queryFn: getModels,
	});
