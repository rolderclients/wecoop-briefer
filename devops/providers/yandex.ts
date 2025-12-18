import { env } from '../env';
import type { Stage } from '../types';
import { readFile, writeFile } from '../utils';

export const setYandexServiceAccount = () => {
	const { projectName, appName } = env;

	const folderId = process.env.YC_FOLDER_ID;
	if (!folderId)
		throw new Error('YC_FOLDER_ID environment variable is not set');

	const accountJson = readFile('yc_account.json');

	const account =
		$app.stage !== 'init'
			? yandex.IamServiceAccount.get(projectName, accountJson.id)
			: new yandex.IamServiceAccount('ServiceAccount', {
					name: `${projectName}-${appName}`,
				});

	account.id.apply((id) => writeFile(`yc_account.json`, { id }));

	new yandex.ResourcemanagerFolderIamMember('ServiceAccountAccess', {
		folderId,
		role: 'storage.editor',
		member: $interpolate`serviceAccount:${account.id}`,
	});
};

export const setYandexStorageBucket = () => {
	const { projectName, bucket, domain, subDomain } = env;

	const accountJson = readFile('yc_account.json');

	const yandexStorageKeys = new yandex.IamServiceAccountStaticAccessKey(
		'StaticKey',
		{
			serviceAccountId: accountJson.id,
			description: `Static S3 key for ${projectName}`,
		},
	);

	yandexStorageKeys.accessKey.apply((accessKey) => {
		yandexStorageKeys.secretKey.apply((secretKey) =>
			writeFile('yc_storage_keys.json', {
				accessKey: accessKey,
				secretKey: secretKey,
			}),
		);
	});

	new yandex.StorageBucket('Bucket', {
		bucket: bucket[$app.stage as Stage],
		accessKey: yandexStorageKeys.accessKey.apply((key) => key),
		secretKey: yandexStorageKeys.secretKey.apply((key) => key),
		forceDestroy: true,
		corsRules: [
			{
				allowedOrigins: [
					'http://localhost:3000',
					`https://${subDomain[$app.stage as Stage]}.${domain[$app.stage as Stage]}`,
				],
				allowedMethods: ['GET', 'PUT', 'POST', 'DELETE'],
				allowedHeaders: ['*'],
				exposeHeaders: ['ETag'],
			},
		],
	});
};
