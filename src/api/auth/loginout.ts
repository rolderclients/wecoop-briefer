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
		const appSession = await useAppSession();

		try {
			const { access, refresh } = await db.signin({
				namespace: db.namespace,
				database: db.database,
				access: 'user',

				variables: {
					email: data.email,
					password: data.password,
				},
			});

			const user = await db.auth<User>();

			if (!user) return { error: codes.UNKNOWN_ERROR };

			const userDTO = { ...user, id: user.id.toString() };
			const { password: _, notSecure: __, ...securedUser } = userDTO;

			await appSession.update({
				user: securedUser,
				tokens: { access, refresh },
			});

			const unsub = db.subscribe('auth', (p) => {
				console.log('auth', p);
			});
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
