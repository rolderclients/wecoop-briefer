import type { Session } from '@/lib';

export type User = Omit<Session['user'], 'username' | 'role'> & {
	username: string;
	role: 'admin' | 'manager';
};

export type CreateUser = Omit<
	User,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'emailVerified'
	| 'displayUsername'
	| 'banned'
> & { password: string };

export type UpdateUser = Omit<
	User,
	| 'createdAt'
	| 'updatedAt'
	| 'emailVerified'
	| 'username'
	| 'displayUsername'
	| 'banned'
	| 'role'
>;

export type CredentialsUser = {
	id: string;
	username: string;
	newPassword: string;
	role: User['role'];
};
export type BlockUser = { id: string; block: boolean };
