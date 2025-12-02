import { handleRequest, type Router, route } from '@better-upload/server';
import { custom } from '@better-upload/server/clients';
import { createFileRoute } from '@tanstack/react-router';

const bucket = process.env.BUCKET_NAME;
if (!bucket) throw new Error('BUCKET_NAME environment variable is not set');

const accessKeyId = process.env.YANDEX_STORAGE_ACCESS_KEY;
const secretAccessKey = process.env.YANDEX_STORAGE_SECRET_KEY;
if (!accessKeyId)
	throw new Error('YANDEX_STORAGE_ACCESS_KEY environment variable is not set');
if (!secretAccessKey)
	throw new Error('YANDEX_STORAGE_SECRET_KEY environment variable is not set');

const s3 = custom({
	host: 'storage.yandexcloud.net',
	accessKeyId,
	secretAccessKey,
	region: 'ru-central1',
});

const router: Router = {
	client: s3,
	bucketName: bucket,
	routes: {
		upload: route({
			fileTypes: ['image/*'],
			multipleFiles: true,
			maxFiles: 5,
		}),
	},
};

export const Route = createFileRoute('/api/upload')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				return handleRequest(request, router);
			},
		},
	},
});
