import { env } from './env';

const requiredProjectEnvs = {
	projectName: true,
	appName: true,
	domain: {
		dev: true,
		test: true,
		prod: true,
	},
	subDomain: {
		dev: true,
		test: true,
		prod: true,
	},
	repoUrl: true,
	branch: {
		dev: true,
		test: true,
		prod: true,
	},
	bucket: true,
	SURREALDB_URL: {
		dev: true,
		test: true,
		prod: true,
	},
	SURREALDB_NAMESPACE: {
		dev: true,
		test: true,
		prod: true,
	},
	SURREALDB_DATABASE: {
		dev: true,
		test: true,
		prod: true,
	},
	SURREALDB_PASSWORD: {
		dev: true,
		test: true,
		prod: true,
	},
	SURREALDB_USERNAME: {
		dev: true,
		test: true,
		prod: true,
	},
	BETTER_AUTH_URL: {
		dev: true,
		test: true,
		prod: true,
	},
	BETTER_AUTH_SECRET: {
		dev: true,
		test: true,
		prod: true,
	},
	AI_GATEWAY_API_KEY: {
		dev: true,
		test: true,
		prod: true,
	},
} as const;

const requiredEnvVars = {
	CLOUDFLARE_API_TOKEN: true,
	CLOUDFLARE_ZONE_ID: true,
	RENDER_OWNER_ID: true,
	RENDER_API_KEY: true,
	YC_CLOUD_ID: true,
	YC_FOLDER_ID: true,
	YC_ZONE: true,
} as const;

const checkNestedEnv = (
	obj: unknown,
	schema: unknown,
	path: string[] = [],
): string[] => {
	const missing: string[] = [];

	// Если схема - это boolean true, проверяем существование значения
	if (schema === true) {
		if (!obj || obj === '' || obj === null || obj === undefined) {
			missing.push(path.join('.'));
		}
		return missing;
	}

	// Если схема - это объект, проверяем его свойства
	if (typeof schema === 'object' && schema !== null) {
		if (!obj || typeof obj !== 'object' || obj === null) {
			missing.push(path.join('.'));
			return missing;
		}

		for (const [key, value] of Object.entries(schema)) {
			const currentPath = [...path, key];
			const objValue = (obj as Record<string, unknown>)[key];

			const nestedMissing = checkNestedEnv(objValue, value, currentPath);
			missing.push(...nestedMissing);
		}
	}

	return missing;
};

export const checkEnv = () => {
	const missingProject = checkNestedEnv(env, requiredProjectEnvs);
	const missingEnv = checkNestedEnv(process.env, requiredEnvVars);

	const allMissing = [...missingProject, ...missingEnv];

	if (allMissing.length > 0) {
		console.error('\nSome environment variables are missing or empty:');

		if (missingProject.length > 0) {
			console.error('\nProject configuration (devops/env.ts):');
			missingProject.forEach((path) => {
				console.error(`  ❌ ${path}`);
			});
		}

		if (missingEnv.length > 0) {
			console.error('\nEnvironment variables (.env file):');
			missingEnv.forEach((path) => {
				console.error(`  ❌ ${path}`);
			});
		}

		console.error(
			'\nPlease check your environment configuration at devops/env.ts and .env file\n',
		);
		process.exit(1);
	}

	console.log('\n✅ All required environment variables are present\n');
};
