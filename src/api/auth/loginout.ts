import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import type { User } from '../db';
import { getDB } from '../db/connection';
import { useAppSession } from './useAppSession';

const codes = {
	INVALID_CREDENTIALS: 'Неверный логин или пароль',
	BLOCKED: 'Пользователь заблокирован',
	UNKNOWN_ERROR: 'Неизвестная ошибка',
};

export interface LoginProps {
	email: string;
	password: string;
	redirect?: string;
}

export type LoginResult = ReturnType<typeof login>;

export const login = createServerFn({ method: 'POST' })
	.inputValidator((data: LoginProps) => data)
	.handler(async ({ data }) => {
		const db = await getDB();
		const session = await useAppSession();

		try {
			await db.signin({
				access: 'user',
				variables: {
					email: data.email,
					password: data.password,
				},
			});

			const dbUser = await db.auth<User>();

			if (!dbUser) return { error: codes.UNKNOWN_ERROR };

			const userWithId = { ...dbUser, id: dbUser.id.toString() };
			const { password: _, notSecure: __, ...user } = userWithId;

			await session.update(user);
		} catch (error) {
			const message = (error as Error).message;
			const parsedCode = message.split('An error occurred: ')[1];

			if (message === 'No record was returned')
				return { error: codes.INVALID_CREDENTIALS };
			if (parsedCode && parsedCode in codes)
				return { error: codes[parsedCode as keyof typeof codes] };

			return { error: codes.UNKNOWN_ERROR, unknownError: true };
		}

		throw redirect({ to: data.redirect });
	});

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
	const session = await useAppSession();
	await session.clear();
	throw redirect({ href: '/' });
});
