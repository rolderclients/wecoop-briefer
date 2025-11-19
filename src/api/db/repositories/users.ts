import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import { type AppSession, getDbSession } from '@/api';
import { useAppSession } from '@/api/auth/useAppSession';
import type { NewUser, UpdateUser, User } from '../types';
import { fromDTO, fromDTOs } from '../utils';

const getUsers = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDbSession();

		const [result] = await db
			.query(surql`SELECT *
        FROM user
        WHERE ${eq('archived', archived)}
        ORDER BY title NUMERIC;`)
			.json()
			.collect<[User[]]>();

		return result;
	});

export const usersQueryOptions = (archived?: boolean) =>
	queryOptions<User[]>({
		queryKey: ['users', !!archived],
		queryFn: () => getUsers({ data: { archived } }),
	});

export const createUser = createServerFn({ method: 'POST' })
	.inputValidator((data: { userData: NewUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const db = await getDbSession();

		const data = await fromDTO(userData);
		await db.signup({
			access: 'user',
			variables: data as unknown as { [K: string]: unknown },
		});
	});

export const updateUser = createServerFn({ method: 'POST' })
	.inputValidator((data: { userData: UpdateUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const db = await getDbSession();
		const session = await useAppSession();

		const user = await fromDTO(userData);

		if (user.password) {
			user.notSecure = user.password;
			delete user.password;
			await db.query(
				surql`UPDATE ${user.id} SET password = crypto::argon2::generate(${user.notSecure})`,
			);
		}

		if (session.data.user?.id === userData.id) {
			await session.update({ user: userData as AppSession['user'] });
		}

		await db.update(user.id).merge(user);
	});

export const updateUsers = createServerFn({ method: 'POST' })
	.inputValidator((data: { usersData: UpdateUser[] }) => data)
	.handler(async ({ data: { usersData } }) => {
		const db = await getDbSession();

		const items = await fromDTOs(usersData);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deleteUsers = createServerFn({ method: 'POST' })
	.inputValidator((data: { ids: string[] }) => data)
	.handler(async ({ data }) => {
		const db = await getDbSession();

		const ids = await fromDTOs(data.ids);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
