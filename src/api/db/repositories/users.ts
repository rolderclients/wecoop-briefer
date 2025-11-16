import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import { getDB } from '../connection';
import type { NewUser, UpdateUser, User } from '../types';
import { fromDTO, fromDTOs } from '../utils';

const getUsers = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

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
		const db = await getDB();

		const data = await fromDTO(userData);
		await db.signup({
			access: 'user',
			variables: data as unknown as { [K: string]: unknown },
		});
	});

export const updateUser = createServerFn({ method: 'POST' })
	.inputValidator((data: { userData: UpdateUser }) => data)
	.handler(async ({ data: { userData } }) => {
		const db = await getDB();

		const item = await fromDTO(userData);

		if (item.password) {
			item.notSecure = item.password;
			delete item.password;
			await db.query(
				surql`UPDATE ${item.id} SET password = crypto::argon2::generate('${item.notSecure}')`,
			);
		}

		await db.update(item.id).merge(item);
	});

export const updateUsers = createServerFn({ method: 'POST' })
	.inputValidator((data: { usersData: UpdateUser[] }) => data)
	.handler(async ({ data: { usersData } }) => {
		const db = await getDB();

		const items = await fromDTOs(usersData);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deleteUsers = createServerFn({ method: 'POST' })
	.inputValidator((data: { ids: string[] }) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data.ids);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
