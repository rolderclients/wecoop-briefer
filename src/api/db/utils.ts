import { createServerOnlyFn } from '@tanstack/react-start';
import { getDB } from './connection';

let tableNames: string[] = [];

export const getTableNames = createServerOnlyFn(async (): Promise<string[]> => {
  if (tableNames.length) return tableNames;

  const db = await getDB();

  try {
    const [result] = await db
      .query('object::keys((INFO FOR DB).tables);')
      .collect<[string[]]>();

    tableNames = result;

    return result;
  } catch (error) {
    console.error('Failed to get table names from SurrealDB:', error);
    tableNames = [];
    throw error;
  }
});
