import { createStart } from '@tanstack/react-start';
import { localeTzMiddleware } from './app';

export const startInstance = createStart(() => ({
	requestMiddleware: [localeTzMiddleware],
}));
