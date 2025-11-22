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
	BLOCKED: 'Пользователь заблокирован',
	BANNED_USER: 'Пользователь заблокирован',
	UNKNOWN_ERROR: 'Неизвестная ошибка',
} satisfies AllErrorCodes;

export type AuthErrorCodes = keyof typeof codes;

// biome-ignore lint/suspicious/noExplicitAny: <>
export const parseAuthError = (code?: AuthErrorCodes, details?: any) => {
	if (code && code in codes)
		return {
			error: true,
			message: codes[code],
			details,
		};

	return {
		error: true,
		message: codes.UNKNOWN_ERROR,
		unknownError: true,
		details,
	};
};
