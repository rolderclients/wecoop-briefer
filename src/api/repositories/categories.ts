import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getDB } from '../db';
import type { Category } from '../types';
import { toDTOs } from '../utils';

const getCategories = createServerFn({ method: 'GET' }).handler(async () => {
  const db = await getDB();

  const [result] = await db
    .query('SELECT * FROM category ORDER BY title;')
    .collect<[Category[]]>();

  return toDTOs(result);
});

export const categoriesQueryOptions = () =>
  queryOptions<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
