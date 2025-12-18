import { createStart } from '@tanstack/react-start';
import { localeMiddleware } from './back';

export const startInstance = createStart(() => ({
	requestMiddleware: [localeMiddleware],
}));
