import { getDB } from './connection';

export async function initializeSchema(): Promise<void> {
  console.log('🔧 Starting database schema initialization...');

  try {
    const db = await getDB();
    await db.query('fn::schema();');

    console.log('✅ Schema created successfully');
  } catch (error) {
    console.error('💥 Failed to initialize schema:', error);
    throw error;
  }
}
