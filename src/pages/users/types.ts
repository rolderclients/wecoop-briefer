import type { User } from '@/app';

export type CreateUser = Omit<
	User,
	| 'id'
	| 'createdAt'
	| 'updatedAt'
	| 'emailVerified'
	| 'displayUsername'
	| 'banned'
> & { password: string };

export type EditUser = Omit<
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
export type DeleteUser = { id: string };
