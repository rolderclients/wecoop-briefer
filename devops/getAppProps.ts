import type { App, AppInput } from '.sst/platform/src/config';
import ycAccountKey from '../.sst/yc_account_key.json';
import { env } from './env';

export const getAppProps = (input: AppInput): App => {
	const { projectName, appName } = env;

	return {
		name: `${projectName}-${appName}`,
		removal: input?.stage === 'production' ? 'retain' : 'remove',
		protect: ['production'].includes(input?.stage),
		home: 'cloudflare',
		providers: {
			render: '1.3.6',
			cloudflare: '6.11.0',
			kubernetes: '4.24.1',
			yandex: {
				version: '0.13.0',
				serviceAccountKeyFile: ycAccountKey,
			},
		},
	};
};
