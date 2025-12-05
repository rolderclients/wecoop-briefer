import { createFileRoute } from '@tanstack/react-router';
import { uploadRequest } from '@/back';

export const Route = createFileRoute('/api/files/upload')({
	server: {
		handlers: {
			POST: uploadRequest,
		},
	},
});
