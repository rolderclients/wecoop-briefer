/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
	app(input) {
		return {
			name: 'briefer',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'cloudflare',
			providers: { render: '1.3.6' },
		};
	},
	async run() {
		if (['dev', 'test', 'prod'].includes($app.stage)) {
			const renderProject = new render.Project('wecoop', {
				name: 'Wecoop',
				environments: {
					dev: { name: 'dev', protectedStatus: 'unprotected' },
					test: { name: 'test', protectedStatus: 'unprotected' },
					prod: { name: 'prod', protectedStatus: 'protected' },
				},
			});

			const service = new render.WebService('briefer', {
				name: `briefer-${$app.stage}`,
				environmentId: renderProject.environments.apply(
					(envs) => envs[$app.stage].id,
				),
				plan: 'starter',
				region: 'frankfurt',
				startCommand: 'bun run start',
				envVars: {
					SURREALDB_URL: {
						value:
							$app.stage === 'prod'
								? 'wss://db.wecoop.rolder.dev'
								: 'wss://dt.db.wecoop.rolder.dev',
					},
					SURREALDB_NAMESPACE: { value: $app.stage },
					SURREALDB_DATABASE: { value: 'data' },
					SURREALDB_USERNAME: { value: 'root' },
					SURREALDB_PASSWORD: { value: process.env.SURREALDB_PASSWORD },
					BETTER_AUTH_URL: {
						value:
							$app.stage === 'prod'
								? 'wss://wecoop.rolder.dev'
								: `https://${$app.stage}.briefer.wecoop.rolder.dev`,
					},
					BETTER_AUTH_SECRET: { value: process.env.BETTER_AUTH_SECRET },
					AI_GATEWAY_API_KEY: { value: process.env.AI_GATEWAY_API_KEY },
				},
				customDomains: [
					{
						name:
							$app.stage === 'prod'
								? 'https://briefer.wecoop.rolder.dev'
								: `https://${$app.stage}.briefer.wecoop.rolder.dev`,
					},
				],
				runtimeSource: {
					nativeRuntime: {
						autoDeploy: true,
						branch: 'master',
						repoUrl: 'https://github.com/rolderclients/wecoop-briefer',
						buildCommand: 'bun install && bun run build',
						runtime: 'node',
					},
				},
			});

			return { url: service.url };
		}
	},
});
