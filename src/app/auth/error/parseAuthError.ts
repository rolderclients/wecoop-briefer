import type { AllErrorCodes, ParsedAuthError } from './types';

const codes = {
	DB_UNAUTHORIZED: 'Сессия авторизации просрочена',
	INVALID_CREDENTIALS: 'Неверный логин или пароль',
	INVALID_USERNAME_OR_PASSWORD: 'Неверный логин или пароль',
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
		'Пользователь с таким email уже существует',
	BLOCKED: 'Пользователь заблокирован',
	BANNED_USER: 'Пользователь заблокирован',
	UNKNOWN_ERROR: 'Системная ошибка авторизации',
} satisfies AllErrorCodes;

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
		message: codes.UNKNOWN_ERROR,
		unknownError: true,
		details,
	};
};
