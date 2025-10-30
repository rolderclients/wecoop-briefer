import { createServerOnlyFn } from '@tanstack/react-start';
import { StringRecordId } from 'surrealdb';
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

export const qp = {
  time: 'time.{ created: created.to_string(), updated: updated.to_string() }',
  id: 'id.to_string()',
  idO: 'id: id.to_string()',
};

/**
 * Converts DTO back to SurrealDB Record recursively
 */
export const fromDTO = async <T>(dto: T): Promise<T> => {
  const tableNames = await getTableNames();
  return convertStringsToRecordIds(dto, tableNames) as T;
};

/**
 * Converts array of DTOs back to SurrealDB Records recursively
 */
export const fromDTOs = async <T>(dtos: T[]): Promise<T[]> => {
  const tableNames = await getTableNames();
  return dtos.map((dto) => convertStringsToRecordIds(dto, tableNames) as T);
};

/**
 * Recursively converts string IDs back to RecordId instances
 */
const convertStringsToRecordIds = (
  obj: unknown,
  tableNames: string[],
): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's an array, recursively process each element
  if (Array.isArray(obj)) {
    return obj.map((item) => convertStringsToRecordIds(item, tableNames));
  }

  // If it's an object, recursively process each property
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Convert id fields and fields ending with Id back to RecordId
      if (typeof value === 'string') {
        // Check if the string contains any table name prefix
        const matchingTable = tableNames.find((table) =>
          value.includes(`${table}:`),
        );
        if (matchingTable) {
          result[key] = new StringRecordId(value);
        } else {
          result[key] = convertStringsToRecordIds(value, tableNames);
        }
      } else {
        result[key] = convertStringsToRecordIds(value, tableNames);
      }
    }
    return result;
  }

  if (typeof obj === 'string') {
    // Check if the string contains any table name prefix
    const matchingTable = tableNames.find((table) => obj.includes(`${table}:`));
    if (matchingTable) {
      return new StringRecordId(obj);
    }
  }

  // For primitive types, return as is
  return obj;
};
