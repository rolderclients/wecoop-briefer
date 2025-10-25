import { RecordId, StringRecordId } from 'surrealdb';
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
export const fromDTO = <T>(dto: T): T => {
  return convertStringsToRecordIds(dto) as T;
};

/**
 * Converts array of DTOs back to SurrealDB Records recursively
 */
export const fromDTOs = <T>(dtos: T[]): T[] => {
  return dtos.map((dto) => fromDTO(dto));
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
const convertStringsToRecordIds = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // If it's an array, recursively process each element
  if (Array.isArray(obj)) {
    return obj.map((item) => convertStringsToRecordIds(item));
  }

  // If it's an object, recursively process each property
  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Convert id fields and fields ending with Id back to RecordId
      if (typeof value === 'string' && value.includes(':')) {
        result[key] = new StringRecordId(value);
      } else {
        result[key] = convertStringsToRecordIds(value);
      }
    }
    return result;
  }

  if (typeof obj === 'string' && obj.includes(':')) {
    return new StringRecordId(obj);
  }

  // For primitive types, return as is
  return obj;
};
