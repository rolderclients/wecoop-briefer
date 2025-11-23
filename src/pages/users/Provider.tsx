import { useDisclosure } from '@mantine/hooks';
import {
	type UseMutationResult,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { usersQueryOptions } from '@/api';
import type { ParsedAuthError, User } from '@/app';
import type {
	BlockUser,
	CreateUser,
	CredentialsUser,
	DeleteUser,
	EditUser,
} from './types';
import { useMutations } from './useMutations';

interface UsersContext {
	users: User[];
	createMutation: UseMutationResult<void, ParsedAuthError, CreateUser, unknown>;
	editMutation: UseMutationResult<void, ParsedAuthError, EditUser, unknown>;
	editCredentialsMutation: UseMutationResult<
		void,
		ParsedAuthError,
		CredentialsUser,
		unknown
	>;
	editBlockMutation: UseMutationResult<
		void,
		ParsedAuthError,
		BlockUser,
		unknown
	>;
	deleteMutation: UseMutationResult<void, ParsedAuthError, DeleteUser, unknown>;
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
		editMutation,
		editCredentialsMutation,
		editBlockMutation,
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
		editMutation,
		editCredentialsMutation,
		editBlockMutation,
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
