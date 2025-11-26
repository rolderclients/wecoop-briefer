import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { roles } from './permissions';

export const {
	signIn,
	signOut,
	signUp,
	useSession,
	revokeSessions,
	$ERROR_CODES,
} = createAuthClient({ plugins: [adminClient({ roles }), usernameClient()] });

export type BetterAuthErrorCodes = keyof typeof $ERROR_CODES;
