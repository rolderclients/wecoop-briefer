import { useDisclosure } from '@mantine/hooks';
import {
	type UseMutationResult,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { usersQueryOptions } from '@/api';
import type {
	AuthError,
	BlockUser,
	CreateUser,
	CredentialsUser,
	UpdateUser,
	User,
} from '@/app';
import { useMutations } from './useMutations';

interface UsersContext {
	users: User[];
	createMutation: UseMutationResult<unknown, AuthError, CreateUser, unknown>;
	updateMutation: UseMutationResult<unknown, AuthError, UpdateUser, unknown>;
	updateCredentialsMutation: UseMutationResult<
		unknown,
		AuthError,
		CredentialsUser,
		unknown
	>;
	updateBlockMutation: UseMutationResult<
		unknown,
		AuthError,
		BlockUser,
		unknown
	>;
	deleteMutation: UseMutationResult<unknown, AuthError, string, unknown>;
	selectedUser: User | null;
	setSelectedUser: (id: string | null) => void;
	createOpened: boolean;
	openCreate: () => void;
	closeCreate: () => void;
	editOpened: boolean;
	openEdit: () => void;
	closeEdit: () => void;
	editCredentialsOpened: boolean;
	openEditCredentials: () => void;
	closeEditCredentials: () => void;
	deleteOpened: boolean;
	openDelete: () => void;
	closeDelete: () => void;
}

const UsersContext = createContext<UsersContext | null>(null);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
	const { data: users } = useSuspenseQuery(usersQueryOptions());
	const [selectedUser, setSelectedUser] = useState<User | null>(null);

	const [createOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [editOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);
	const [
		editCredentialsOpened,
		{ open: openEditCredentials, close: closeEditCredentials },
	] = useDisclosure(false);
	const [deleteOpened, { open: openDelete, close: closeDelete }] =
		useDisclosure(false);

	const {
		createMutation,
		updateMutation,
		updateCredentialsMutation,
		updateBlockMutation,
		deleteMutation,
	} = useMutations({
		users,
		closeCreate,
		closeEdit,
		closeEditCredentials,
		closeDelete,
	});

	const value = {
		users,
		createMutation,
		updateMutation,
		updateCredentialsMutation,
		updateBlockMutation,
		deleteMutation,
		selectedUser,
		setSelectedUser: (id: string | null) => {
			const user = users.find((user) => user.id === id);
			if (user) setSelectedUser(user);
			else setSelectedUser(null);
		},
		createOpened,
		openCreate,
		closeCreate,
		editOpened,
		openEdit,
		closeEdit,
		editCredentialsOpened,
		openEditCredentials,
		closeEditCredentials,
		deleteOpened,
		openDelete,
		closeDelete,
	};

	return (
		<UsersContext.Provider value={value}>{children}</UsersContext.Provider>
	);
};

export const useUsers = () => {
	const context = useContext(UsersContext);
	if (!context) {
		throw new Error('useUsers must be used within UsersProvider');
	}
	return context;
};
