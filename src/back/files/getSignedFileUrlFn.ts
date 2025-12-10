import { presignGetObject } from '@better-upload/server/helpers';
import { createServerFn } from '@tanstack/react-start';
import z from 'zod/v4';
import { getS3Client } from './getS3Client';

const Schema = z.object({
	s3Key: z.string(),
});

export const getSignedFileUrlFn = createServerFn({ method: 'POST' })
	.inputValidator(Schema)
	.handler(async ({ data: { s3Key } }) => {
		const bucket = process.env.BUCKET_NAME;
		if (!bucket) throw new Error('BUCKET_NAME environment variable is not set');

		const s3 = getS3Client();

		const url = await presignGetObject(s3, {
			bucket,
			key: s3Key,
			expiresIn: 300,
		});

		return url;
	});
