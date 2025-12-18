import { getDBFn } from './connection';

export * from './connection';
export * from './repositories';

export const getDB = getDBFn;
