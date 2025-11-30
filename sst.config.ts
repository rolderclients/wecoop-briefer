/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
	app(input) {
		return {
			name: 'briefer',
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'cloudflare',
			providers: { render: { skipDeployAfterServiceUpdate: true } },
		};
	},
	async run() {
		const username = new sst.Secret('SURREALDB_USERNAME');
		const password = new sst.Secret('SURREALDB_PASSWORD');
		const aiGatewayApiKey = new sst.Secret('AI_GATEWAY_API_KEY');
		const authSessionSecret = new sst.Secret('BETTER_AUTH_SECRET');

		const project = new sst.Linkable('Project', {
			properties: {
				db: {
					url:
						$dev || $app.stage === 'test'
							? 'wss://dt.db.wecoop.rolder.dev'
							: $app.stage === 'prod'
								? 'wss://dt.db.wecoop.rolder.prod'
								: 'wss://db.wecoop.rolder.dev',
					namespace: $dev ? 'dev' : $app.stage,
					database: 'data',
					username: username.value,
					password: password.value,
				},
				ai: {
					gatewayApiKey: aiGatewayApiKey.value,
				},
				auth: {
					url: $dev
						? 'http://localhost:3000'
						: $app.stage === 'prod'
							? 'https://briefer.wecoop.rolder.dev'
							: `https://${$app.stage}.briefer.wecoop.rolder.dev`,
					sessionSecret: authSessionSecret.value,
				},
			},
		});

		if ($dev) {
			new sst.x.DevCommand('Dev', {
				link: [project],
				dev: {
					autostart: true,
					command: 'vite dev',
				},
				environment: { PORT: '3000' },
			});

			new sst.x.DevCommand('Preview', {
				link: [project],
				dev: {
					autostart: false,
					command: 'bun server.ts',
				},
				environment: { PORT: '8080' },
			});
		}

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
				// customDomains: [
				// 	{
				// 		name:
				// 			$app.stage === 'prod'
				// 				? 'https://briefer.wecoop.rolder.dev'
				// 				: `https://${$app.stage}.briefer.wecoop.rolder.dev`,
				// 	},
				// ],
				runtimeSource: {
					nativeRuntime: {
						autoDeploy: false,
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
