/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
	async app(input) {
		const props = await import('./devops').then((m) => m.getAppProps(input));

		return props;
	},
	async run() {
		const {
			getRenderProject,
			getRenderService,
			getCloudflareDns,
			getYandexServiceAccount,
			setYandexStorageBucket,
			setDev,
		} = await import('./devops');

		if (['init', 'dev', 'test', 'prod'].includes($app.stage)) {
			const renderProject = getRenderProject();

			if ($app.stage === 'init') {
				const folderId = process.env.YC_FOLDER_ID;
				if (!folderId)
					throw new Error('YC_FOLDER_ID environment variable is not set');

				const accountId = getYandexServiceAccount();
				setYandexStorageBucket(accountId);
			} else {
				const service = getRenderService(
					renderProject.environments.apply((envs) => envs[$app.stage].id),
				);

				const dns = getCloudflareDns(
					service.url.apply((url) => url.replace('https://', '')),
				);

				return { url: dns.name.apply((name) => `https://${name}.rolder.dev`) };
			}
		} else if ($dev) {
			setDev();
		}
	},
});
