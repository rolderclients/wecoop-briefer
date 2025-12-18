import {
	handleRequest,
	RejectUpload,
	type Router,
	route,
} from '@better-upload/server';
import { createServerOnlyFn } from '@tanstack/react-start';
import { z } from 'zod/v4';
import { getS3Client } from './getS3Client';

const MetadataSchema = z.object({
	s3Keys: z.record(z.string(), z.string()),
	fileTypes: z.array(z.string()),
	maxFiles: z.number(),
	maxFileSize: z.number(),
});

const getRouter = createServerOnlyFn(
	(data: z.output<typeof MetadataSchema>) => {
		const bucket = process.env.BUCKET_NAME;
		if (!bucket) throw new Error('BUCKET_NAME environment variable is not set');

		const s3 = getS3Client();

		const { s3Keys, ...params } = data;

		const router: Router = {
			client: s3,
			bucketName: bucket,
			routes: {
				upload: route({
					multipleFiles: true,
					...params,
					onBeforeUpload: async () => {
						const { success } = MetadataSchema.safeParse(data);
						if (!success) throw new RejectUpload('Invalid metadata');

						return {
							generateObjectInfo: ({ file }) => {
								return { key: s3Keys[file.name] };
							},
						};
					},
				}),
			},
		};

		return router;
	},
);

export const uploadRequest = async ({ request }: { request: Request }) => {
	const clonedRequest = request.clone();
	const body = await clonedRequest.json();

	return handleRequest(request, getRouter(body.metadata));
};
