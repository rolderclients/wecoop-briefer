import type { ErrorCodes, ParsedAuthError } from './types';

const codes = {
	INVALID_USERNAME_OR_PASSWORD: 'Неверный логин или пароль',
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
		'Пользователь с таким email уже существует',
	BANNED_USER: 'Пользователь заблокирован',
} satisfies ErrorCodes;

export type AuthErrorCodes = keyof typeof codes;

export const parseAuthError = (
	code?: AuthErrorCodes,
	details?: string,
): ParsedAuthError => {
	if (code && code in codes)
		return {
			message: codes[code],
			details,
		};

	return {
		message: 'Системная ошибка авторизации',
		unknownError: true,
		details,
	};
};
