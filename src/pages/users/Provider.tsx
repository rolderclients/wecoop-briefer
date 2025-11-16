import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
	createUser,
	deleteUsers,
	type NewUser,
	type UpdateUser,
	type User,
	updateUser,
	updateUsers,
	usersQueryOptions,
} from '@/api';

interface UsersContext {
	users: User[];
	createUser: (userData: NewUser) => void;
	updateUser: (userData: UpdateUser) => void;
	updateUsers: (usersData: UpdateUser[]) => void;
	deleteUsers: (ids: string[]) => void;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	archived?: boolean;
	setArchived: (archived: boolean) => void;
}

const UsersContext = createContext<UsersContext | null>(null);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { archived: initialArchived } = useSearch({ from: '/users' });
	const [archived, setArchived] = useState(initialArchived);
	const { data: users } = useSuspenseQuery(usersQueryOptions(initialArchived));

	const queryClient = useQueryClient();
	const createUserMutation = useMutation({
		mutationFn: (userData: NewUser) => createUser({ data: { userData } }),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});

	const updateUserMutation = useMutation({
		mutationFn: (userData: UpdateUser) => updateUser({ data: { userData } }),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});

	const updateUsersMutation = useMutation({
		mutationFn: (usersData: UpdateUser[]) =>
			updateUsers({ data: { usersData } }),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});

	const deleteUsersMutation = useMutation({
		mutationFn: (ids: string[]) => deleteUsers({ data: { ids } }),
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
	});

	const value = {
		users,
		createUser: createUserMutation.mutate,
		updateUser: updateUserMutation.mutate,
		updateUsers: updateUsersMutation.mutate,
		deleteUsers: deleteUsersMutation.mutate,
		selectedIds,
		setSelectedIds,
		archived,
		setArchived,
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
