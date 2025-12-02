import { createFileRoute } from '@tanstack/react-router';
import { upload } from '@/back';

export const Route = createFileRoute('/api/upload')({
	server: {
		handlers: {
			POST: upload,
		},
	},
});
