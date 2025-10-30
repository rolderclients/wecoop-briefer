import { RecordId, StringRecordId } from 'surrealdb';
import { getTableNames } from './db/utils';
import type { Item } from './types';

/**
 * Converts SurrealDB Record to DTO recursively
 */
export const toDTO = <T extends Item>(record: T): T => {
  return convertRecordIds(record) as T;
};

/**
 * Converts array of SurrealDB Records to DTOs recursively
 */
export const toDTOs = <T extends Item>(records: T[]): T[] => {
  return records.map((record) => toDTO(record));
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
 * Recursively converts all RecordId instances to strings
 */
const convertRecordIds = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's a RecordId, convert to string
  if (obj instanceof RecordId) {
    return obj.toString();
  }

  // If it's an array, recursively process each element
  if (Array.isArray(obj)) {
    return obj.map((item) => convertRecordIds(item));
  }

  // If it's an object, recursively process each property
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertRecordIds(value);
    }
    return result;
  }

  // For primitive types, return as is
  return obj;
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
