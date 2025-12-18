import { custom } from '@better-upload/server/clients';

export const getS3Client = () => {
	const accessKeyId = process.env.YANDEX_STORAGE_ACCESS_KEY;
	if (!accessKeyId)
		throw new Error(
			'YANDEX_STORAGE_ACCESS_KEY environment variable is not set',
		);

	const secretAccessKey = process.env.YANDEX_STORAGE_SECRET_KEY;
	if (!secretAccessKey)
		throw new Error(
			'YANDEX_STORAGE_SECRET_KEY environment variable is not set',
		);

	return custom({
		host: 'storage.yandexcloud.net',
		accessKeyId,
		secretAccessKey,
		region: 'ru-central1',
	});
};
