import { adminClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { ac, roles } from './permissions';

export const { signIn, signOut, signUp, useSession, admin, $ERROR_CODES } =
	createAuthClient({
		plugins: [adminClient({ ac, roles }), usernameClient()],
	});

export type BetterAuthErrorCodes = keyof typeof $ERROR_CODES;
