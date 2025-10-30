import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getDB } from '../db';
import type { Model } from '../types';
import { toDTOs } from '../utils';

const getModels = createServerFn({ method: 'GET' }).handler(async () => {
  const db = await getDB();

  const [result] = await db
    .query('SELECT * FROM model ORDER BY title NUMERIC;')
    .collect<[Model[]]>();

  return toDTOs(result);
});

export const modelsQueryOptions = () =>
  queryOptions<Model[]>({
    queryKey: ['models'],
    queryFn: getModels,
  });
