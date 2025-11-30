/// <reference path="./.sst/platform/config.d.ts" />

// ###################################################
const projectName = process.env.PROJECT_NAME;
const appName = process.env.APP_NAME;
// ###################################################

export default $config({
	app(input) {
		if (!appName) throw new Error('APP_NAME environment variable is not set');

		return {
			name: appName,
			removal: input?.stage === 'production' ? 'retain' : 'remove',
			protect: ['production'].includes(input?.stage),
			home: 'cloudflare',
			providers: {
				render: '1.3.6',
				cloudflare: '6.11.0',
				kubernetes: '4.24.1',
			},
		};
	},
	async run() {
		if (!projectName)
			throw new Error('PROJECT_NAME environment variable is not set');
		if (!appName) throw new Error('APP_NAME environment variable is not set');

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
				const password = process.env.SURREALDB_PASSWORD;
				if (!password)
					throw new Error('SURREALDB_PASSWORD environment variable is not set');
				const suthSecret = process.env.BETTER_AUTH_SECRET;
				if (!suthSecret)
					throw new Error('BETTER_AUTH_SECRET environment variable is not set');
				const aiGatewayApiKey = process.env.AI_GATEWAY_API_KEY;
				if (!aiGatewayApiKey)
					throw new Error('AI_GATEWAY_API_KEY environment variable is not set');

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
						SURREALDB_PASSWORD: { value: password },
						BETTER_AUTH_URL: {
							value:
								$app.stage === 'prod'
									? `https://${appName}.${projectName}.rolder.dev`
									: `https://${$app.stage}.${appName}.${projectName}.rolder.dev`,
						},
						BETTER_AUTH_SECRET: { value: suthSecret },
						AI_GATEWAY_API_KEY: { value: aiGatewayApiKey },
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
				if (!zoneId)
					throw new Error('CLOUDFLARE_ZONE_ID environment variable is not set');

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
