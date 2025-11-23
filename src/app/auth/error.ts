/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
import type { BetterAuthErrorCodes } from '@/app';

export type AuthError = {
	code?: string | undefined;
	message?: string | undefined;
	status: number;
	statusText: string;
} | null;

type AllErrorCodes = Partial<
	Record<
		BetterAuthErrorCodes | 'INVALID_CREDENTIALS' | 'BLOCKED' | 'UNKNOWN_ERROR',
		string
	>
>;

const codes = {
	INVALID_CREDENTIALS: 'Неверный логин или пароль',
	INVALID_USERNAME_OR_PASSWORD: 'Неверный логин или пароль',
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
		'Пользователь с таким email уже существует',
	BLOCKED: 'Пользователь заблокирован',
	BANNED_USER: 'Пользователь заблокирован',
	UNKNOWN_ERROR: 'Неизвестная ошибка',
} satisfies AllErrorCodes;

export type AuthErrorCodes = keyof typeof codes;

export type ParsedAuthError = {
	message: string;
	unknownError?: boolean;
	details?: any;
};

export const parseAuthError = (
	code?: AuthErrorCodes,
	details?: any,
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
