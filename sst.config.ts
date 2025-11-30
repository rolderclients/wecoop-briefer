/// <reference path="./.sst/platform/config.d.ts" />
const projectName = 'wecoop';
const appName = 'briefer';

export default $config({
	app(input) {
		return {
			name: appName,
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'cloudflare',
			providers: { render: '1.3.6', cloudflare: '6.11.0' },
		};
	},
	async run() {
		if (['init', 'dev', 'test', 'prod'].includes($app.stage)) {
			const renderProject =
				$app.stage !== 'init'
					? render.Project.get(projectName, 'prj-d4lvv2u3jp1c739k6dkg')
					: new render.Project(projectName, {
							name: projectName,
							environments: {
								dev: { name: 'dev', protectedStatus: 'unprotected' },
								test: { name: 'test', protectedStatus: 'unprotected' },
								prod: { name: 'prod', protectedStatus: 'protected' },
							},
						});

			if ($app.stage !== 'init') {
				const service = new render.WebService(appName, {
					name: `${appName}-${$app.stage}`,
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
									? `wss://db.${projectName}.rolder.dev`
									: `wss://dt.db.${projectName}.rolder.dev`,
						},
						SURREALDB_NAMESPACE: { value: $app.stage },
						SURREALDB_DATABASE: { value: 'data' },
						SURREALDB_USERNAME: { value: 'root' },
						SURREALDB_PASSWORD: { value: process.env.SURREALDB_PASSWORD },
						BETTER_AUTH_URL: {
							value:
								$app.stage === 'prod'
									? `https://${appName}.${projectName}.rolder.dev`
									: `https://${$app.stage}.${appName}.${projectName}.rolder.dev`,
						},
						BETTER_AUTH_SECRET: { value: process.env.BETTER_AUTH_SECRET },
						AI_GATEWAY_API_KEY: { value: process.env.AI_GATEWAY_API_KEY },
					},
					customDomains: [
						{
							name:
								$app.stage === 'prod'
									? `${appName}.${projectName}.rolder.dev`
									: `${$app.stage}.${appName}.${projectName}.rolder.dev`,
						},
					],
					runtimeSource: {
						nativeRuntime: {
							autoDeploy: true,
							branch: $app.stage === 'dev' ? 'master' : $app.stage,
							repoUrl: `https://github.com/rolderclients/${projectName}-${appName}`,
							buildCommand: 'bun install && bun run build',
							runtime: 'node',
						},
					},
				});

				const zoneId = process.env.CLOUDFLARE_ZONE_ID;
				if (!zoneId) {
					throw new Error('CLOUDFLARE_ZONE_ID environment variable is not set');
				}

				const dns = new cloudflare.DnsRecord(`${projectName}-${appName}`, {
					zoneId,
					name:
						$app.stage === 'prod'
							? `${appName}.${projectName}`
							: `${$app.stage}.${appName}.${projectName}`,
					type: 'CNAME',
					content: service.url.apply((url) => url.replace('https://', '')),
					ttl: 1,
				});

				return { url: dns.name.apply((name) => `https://${name}.rolder.dev`) };
			}

			return { renderProjectId: renderProject.id };
		}
	},
});
