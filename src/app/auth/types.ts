import type { UserWithRole } from 'better-auth/plugins';

export type User = Omit<UserWithRole, 'role'> & {
	role: 'admin' | 'manager';
	username: string;
	displayUsername: string;
};
