import { createMiddleware, createStart } from '@tanstack/react-start';
import {
	getCookie,
	getRequestHeader,
	setCookie,
} from '@tanstack/react-start/server';

const localeTzMiddleware = createMiddleware().server(async ({ next }) => {
	const header = getRequestHeader('accept-language');
	const headerLocale = header?.split(',')[0] || 'ru-RU';
	const cookieLocale = getCookie('locale');
	const cookieTz = getCookie('tz');

	const locale = cookieLocale || headerLocale;
	const timeZone = cookieTz || 'UTC';

	setCookie('locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });

	return next({ context: { locale, timeZone } });
});

export const startInstance = createStart(() => ({
	requestMiddleware: [localeTzMiddleware],
}));
