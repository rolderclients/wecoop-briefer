import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import type { APIError } from 'better-auth';
import { type AuthErrorCodes, parseAuthError, type User } from '@/app';
import { authMiddleware } from '@/app/auth/middleware';
import { auth } from '@/lib';
import type {
	BlockUser,
	CreateUser,
	CredentialsUser,
	DeleteUser,
	EditUser,
} from '@/pages';

const getUsersFn = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.handler(async () => {
		const headers = getRequestHeaders();
		const { users } = await auth.api.listUsers({
			headers,
			query: {
				sortBy: 'createdAt',
				sortDirection: 'desc',
			},
		});

		return users as User[];
	});

export const usersQueryOptions = () =>
	queryOptions<User[]>({
		queryKey: ['users'],
		queryFn: getUsersFn,
	});

export const createUserFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { userData: CreateUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const headers = getRequestHeaders();
		try {
			await auth.api.createUser({
				headers,
				body: {
					name: userData.name,
					email: userData.email,
					password: userData.password,
					role: userData.role,
					data: {
						username: userData.username,
						displayUsername: userData.username,
					},
				},
			});
		} catch (e) {
			const error = e as APIError;
			console.log(error);
			throw parseAuthError(error.body?.code as AuthErrorCodes, error.message);
		}
	});

export const updateUserFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { userData: EditUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const headers = getRequestHeaders();
		try {
			await auth.api.adminUpdateUser({
				headers,
				body: {
					userId: userData.id,
					data: {
						name: userData.name,
						email: userData.email,
					},
				},
			});
		} catch (e) {
			const error = e as APIError;
			console.log(error);
			throw parseAuthError(error.body?.code as AuthErrorCodes, error.message);
		}
	});

export const changeUserCredentialsFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { userData: CredentialsUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const headers = getRequestHeaders();
		try {
			await auth.api.adminUpdateUser({
				headers,
				body: {
					userId: userData.id,
					data: { username: userData.username, role: userData.role },
				},
			});

			await auth.api.setRole({
				headers,
				body: {
					userId: userData.id,
					role: userData.role,
				},
			});

			await auth.api.setUserPassword({
				headers,
				body: {
					userId: userData.id,
					newPassword: userData.newPassword,
				},
			});
		} catch (e) {
			const error = e as APIError;
			console.log(error);
			throw parseAuthError(error.body?.code as AuthErrorCodes, error.message);
		}
	});

export const changeUserBlockFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { userData: BlockUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const headers = getRequestHeaders();

		try {
			if (userData.block) {
				await auth.api.banUser({
					headers,
					body: { userId: userData.id },
				});
			} else {
				await auth.api.unbanUser({
					headers,
					body: { userId: userData.id },
				});
			}
		} catch (e) {
			const error = e as APIError;
			console.log(error);
			throw parseAuthError(error.body?.code as AuthErrorCodes, error.message);
		}
	});

export const deleteUserFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { userData: DeleteUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const headers = getRequestHeaders();
		try {
			await auth.api.removeUser({
				headers,
				body: { userId: userData.id },
			});
		} catch (e) {
			const error = e as APIError;
			console.log(error);
			throw parseAuthError(error.body?.code as AuthErrorCodes, error.message);
		}
	});
