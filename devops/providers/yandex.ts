import type { Output } from '@pulumi/pulumi';
import { writeFile } from 'devops/utils';
import { env } from '../env';

export const getYandexServiceAccount = () => {
	const { projectName, appName } = env;

	const folderId = process.env.YC_FOLDER_ID;
	if (!folderId)
		throw new Error('YC_FOLDER_ID environment variable is not set');

	const account = new yandex.IamServiceAccount('ServiceAccount', {
		name: `${projectName}-${appName}`,
	});

	new yandex.ResourcemanagerFolderIamMember('ServiceAccountAccess', {
		folderId,
		role: 'storage.editor',
		member: $interpolate`serviceAccount:${account.id}`,
	});

	return account.id.apply((id) => id);
};

export const setYandexStorageBucket = (serviceAccountId: Output<string>) => {
	const { projectName, bucket } = env;

	const yandexStorageKeys = new yandex.IamServiceAccountStaticAccessKey(
		'StaticKey',
		{
			serviceAccountId,
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
		bucket,
		accessKey: yandexStorageKeys.accessKey.apply((key) => key),
		secretKey: yandexStorageKeys.secretKey.apply((key) => key),
		forceDestroy: true,
	});
};
