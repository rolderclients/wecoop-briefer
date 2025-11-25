import { createStart } from '@tanstack/react-start';
import { localeMiddleware } from './app';

export const startInstance = createStart(() => ({
	requestMiddleware: [localeMiddleware],
}));
