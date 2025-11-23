import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	changeUserBlockFn,
	changeUserCredentialsFn,
	createUserFn,
	deleteUserFn,
	updateUserFn,
} from '@/api';
import { type ParsedAuthError, type User, useAuth } from '@/app';
import { errorNotification } from './errorNotification';
import type {
	BlockUser,
	CreateUser,
	CredentialsUser,
	DeleteUser,
	EditUser,
} from './types';

export const useMutations = ({
	users,
	closeCreate,
	closeEdit,
	closeEditCredentials,
	closeDelete,
}: {
	users: User[];
	closeCreate: () => void;
	closeEdit: () => void;
	closeEditCredentials: () => void;
	closeDelete: () => void;
}) => {
	const queryClient = useQueryClient();
	const { user: authedUser, refetch } = useAuth();

	const createMutation = useMutation<void, ParsedAuthError, CreateUser>({
		mutationFn: (userData) => createUserFn({ data: { userData } }),
		onSettled: (_, error, vars) => {
			if (error) errorNotification(error);
			else {
				closeCreate(); // Перед загрузкой измененных данных, симпотичнее так.
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					notifications.show({
						message: `Учетная запись сотрудника "${vars.name}" добавлена`,
						color: 'green',
					});
				});
			}
		},
	});

	const editMutation = useMutation<void, ParsedAuthError, EditUser>({
		mutationFn: (userData: EditUser) => updateUserFn({ data: { userData } }),
		onSettled: (_, error, vars) => {
			if (error) errorNotification(error);
			else {
				if (authedUser?.id === vars.id) refetch();
				closeEdit();
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					notifications.show({
						message: `Запись сотрудника "${vars.name}" обновлена`,
						color: 'green',
					});
				});
			}
		},
	});

	const editCredentialsMutation = useMutation<
		void,
		ParsedAuthError,
		CredentialsUser
	>({
		mutationFn: (userData) => changeUserCredentialsFn({ data: { userData } }),
		onSettled: (_, error, vars) => {
			if (error) errorNotification(error);
			else {
				if (authedUser?.id === vars.id) refetch();
				closeEditCredentials();
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					const user = users.find((user) => user.id === vars.id);

					notifications.show({
						message: `Данные учетной записи сотрудника "${user?.name}" изменены`,
						color: 'green',
					});
				});
			}
		},
	});

	const editBlockMutation = useMutation<void, ParsedAuthError, BlockUser>({
		mutationFn: (userData) => changeUserBlockFn({ data: { userData } }),
		onSettled: (_, error, vars) => {
			if (error) errorNotification(error);
			else {
				// router.invalidate();
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					const user = users.find((user) => user.id === vars.id);

					notifications.show({
						message: `Учетная запись сотрудника "${user?.name}" ${vars.block ? 'заблокирована' : 'разблокирована'}`,
						color: vars.block ? 'orange' : 'green',
					});
				});
			}
		},
	});

	const deleteMutation = useMutation<void, ParsedAuthError, DeleteUser>({
		mutationFn: (userData) => deleteUserFn({ data: { userData } }),
		onSettled: (_, error, vars) => {
			if (error) errorNotification(error);
			else {
				closeDelete();
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					const user = users.find((u) => u.id === vars.id);

					notifications.show({
						message: `Учетная запись сотрудника "${user?.name}" удалена`,
						color: 'orange',
					});
				});
			}
		},
	});

	return {
		createMutation,
		editMutation,
		editCredentialsMutation,
		editBlockMutation,
		deleteMutation,
	};
};
