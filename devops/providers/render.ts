/// <reference path="../../.sst/platform/config.d.ts" />

import type { Output } from '@pulumi/pulumi';
import { readFile, writeFile } from 'devops/utils';
import { env } from '../env';
import type { Stage } from '../types';

export const getRenderProject = () => {
	const { projectName } = env;

	const projectJson = readFile('project.json');

	const project =
		$app.stage !== 'init'
			? render.Project.get(projectName, projectJson.id)
			: new render.Project(projectName, {
					name: projectName,
					environments: {
						dev: { name: 'dev', protectedStatus: 'unprotected' },
						test: { name: 'test', protectedStatus: 'unprotected' },
						prod: { name: 'prod', protectedStatus: 'protected' },
					},
				});

	project.id.apply((id) => writeFile(`project.json`, { id }));

	return project;
};

export const getRenderService = (environmentId: Output<string>) => {
	const {
		appName,
		domain,
		subDomain,
		branch,
		repoUrl,
		SURREALDB_URL,
		SURREALDB_NAMESPACE,
		SURREALDB_DATABASE,
		SURREALDB_USERNAME,
		SURREALDB_PASSWORD,
		BETTER_AUTH_URL,
		BETTER_AUTH_SECRET,
		AI_GATEWAY_API_KEY,
		bucket,
	} = env;

	const yandexStorageKeys = readFile('yc_storage_keys.json');

	return new render.WebService(appName, {
		name: `${appName}-${$app.stage}`,
		environmentId,
		plan: 'starter',
		region: 'frankfurt',
		startCommand: 'bun run start',
		envVars: {
			SURREALDB_URL: { value: SURREALDB_URL[$app.stage as Stage] },
			SURREALDB_NAMESPACE: { value: SURREALDB_NAMESPACE[$app.stage as Stage] },
			SURREALDB_DATABASE: { value: SURREALDB_DATABASE[$app.stage as Stage] },
			SURREALDB_USERNAME: { value: SURREALDB_USERNAME[$app.stage as Stage] },
			SURREALDB_PASSWORD: { value: SURREALDB_PASSWORD[$app.stage as Stage] },
			BETTER_AUTH_URL: { value: BETTER_AUTH_URL[$app.stage as Stage] },
			BETTER_AUTH_SECRET: { value: BETTER_AUTH_SECRET[$app.stage as Stage] },
			AI_GATEWAY_API_KEY: { value: AI_GATEWAY_API_KEY[$app.stage as Stage] },
			BUCKET_NAME: { value: bucket[$app.stage as Stage] },
			YANDEX_STORAGE_ACCESS_KEY: { value: yandexStorageKeys.accessKey },
			YANDEX_STORAGE_SECRET_KEY: { value: yandexStorageKeys.secretKey },
		},
		customDomains: [
			{
				name: `${subDomain[$app.stage as Stage]}.${domain[$app.stage as Stage]}`,
			},
		],
		runtimeSource: {
			nativeRuntime: {
				autoDeploy: true,
				branch: branch[$app.stage as Stage],
				repoUrl,
				buildCommand: 'bun install && bun run build',
				runtime: 'node',
			},
		},
	});
};
