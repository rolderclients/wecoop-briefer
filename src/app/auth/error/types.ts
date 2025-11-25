import type { BetterAuthErrorCodes } from '../better';

export type AuthError = {
	code?: string | undefined;
	message?: string | undefined;
	status: number;
	statusText: string;
} | null;

export type AllErrorCodes = Partial<
	Record<
		| BetterAuthErrorCodes
		| 'INVALID_CREDENTIALS'
		| 'BLOCKED'
		| 'UNKNOWN_ERROR'
		| 'DB_UNAUTHORIZED',
		string
	>
>;

export type ParsedAuthError = {
	message: string;
	unknownError?: boolean;
	details?: string;
};
