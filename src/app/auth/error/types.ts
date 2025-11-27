import type { BetterAuthErrorCodes } from '../better';

export type AuthError = {
	code?: string | undefined;
	message?: string | undefined;
	status: number;
	statusText: string;
} | null;

export type ErrorCodes = Partial<Record<BetterAuthErrorCodes, string>>;

export type ParsedAuthError = {
	message: string;
	unknownError?: boolean;
	details?: string;
};
