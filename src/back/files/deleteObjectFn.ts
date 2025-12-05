import { deleteObject } from '@better-upload/server/helpers';
import { createServerFn } from '@tanstack/react-start';
import { getS3Client } from './getS3Client';

export const deleteObjectFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const bucket = process.env.BUCKET_NAME;
		if (!bucket) throw new Error('BUCKET_NAME environment variable is not set');

		const s3 = getS3Client();

		await deleteObject(s3, {
			bucket,
			key: data,
		});
	});
