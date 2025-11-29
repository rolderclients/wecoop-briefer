import path from 'node:path';
import { DateTime, Surreal } from 'surrealdb';

const url = process.env.SURREALDB_URL;
const namespace = process.env.SURREALDB_NAMESPACE;
const database = process.env.SURREALDB_DATABASE;
const username = process.env.SURREALDB_USERNAME;
const password = process.env.SURREALDB_PASSWORD;

if (!url || !namespace || !database || !username || !password) {
	throw new Error('Missing required SurrealDB environment variables');
}

const locale = 'ru-RU';
const timeZone = 'UTC';

const db = new Surreal({
	codecOptions: {
		valueDecodeVisitor(value) {
			if (value instanceof DateTime) {
				return new Date(value.toDate()).toLocaleDateString(locale, {
					hour: 'numeric',
					minute: 'numeric',
					timeZone,
				});
			}

			return value;
		},
	},
});

await db.connect(url, { authentication: { username, password } });

await db.use({
	namespace,
	database,
});

const schemaPath = path.resolve('src/back/db/schema.surql');
const schemaFile = Bun.file(schemaPath);
const schema = await schemaFile.text();

await db.query(schema);
await db.close();
