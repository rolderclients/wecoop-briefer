import { presignGetObject } from '@better-upload/server/helpers';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { getS3Client } from './getS3Client';

const S3KeysSchema = z.object({
	s3Keys: z.array(z.string()),
});

export const getSignedFilesUrlsFn = createServerFn({ method: 'POST' })
	.inputValidator(S3KeysSchema)
	.handler(async ({ data: { s3Keys } }) => {
		const bucket = process.env.BUCKET_NAME;
		if (!bucket) throw new Error('BUCKET_NAME environment variable is not set');

		const s3 = getS3Client();

		const urls = await Promise.all(
			s3Keys.map((s3Key) =>
				presignGetObject(s3, {
					bucket,
					key: s3Key,
					expiresIn: 300,
				}),
			),
		);

		return urls;
	});
