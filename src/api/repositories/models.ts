import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getDB } from '../db';
import type { Model } from '../types';

const getModels = createServerFn({ method: 'GET' }).handler(async () => {
	const db = await getDB();

	const [result] = await db
		.query('SELECT * FROM model ORDER BY title NUMERIC;')
		.json()
		.collect<[Model[]]>();

	return result;
});

export const modelsQueryOptions = () =>
	queryOptions<Model[]>({
		queryKey: ['models'],
		queryFn: getModels,
	});
