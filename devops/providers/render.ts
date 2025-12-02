/// <reference path="../../.sst/platform/config.d.ts" />

import type { Output } from '@pulumi/pulumi';
import { env } from '../env';
import type { Stage } from '../types';

export const getRenderProject = () => {
	const { projectName, projectId } = env;

	return $app.stage !== 'init'
		? render.Project.get(projectName, projectId)
		: new render.Project(projectName, {
				name: projectName,
				environments: {
					dev: { name: 'dev', protectedStatus: 'unprotected' },
					test: { name: 'test', protectedStatus: 'unprotected' },
					prod: { name: 'prod', protectedStatus: 'protected' },
				},
			});
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
	} = env;

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
