import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	type AuthError,
	admin,
	authErrorNotification,
	type BlockUser,
	type CreateUser,
	type CredentialsUser,
	type UpdateUser,
	type User,
	useAuth,
} from '@/app';

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

	const createMutation = useMutation<unknown, AuthError, CreateUser>({
		mutationFn: (data) =>
			admin.createUser({
				name: data.name,
				email: data.email,
				password: data.password,
				role: data.role,
				data: {
					username: data.username,
					displayUsername: data.username,
				},
			}),
		onSettled: (_, error, vars) => {
			if (error) authErrorNotification(error);
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

	const updateMutation = useMutation<unknown, AuthError, UpdateUser>({
		mutationFn: (data) =>
			admin.updateUser({
				userId: data.id,
				data: {
					name: data.name,
					email: data.email,
				},
			}),
		onSettled: (_, error, vars) => {
			if (error) authErrorNotification(error);
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

	const updateCredentialsMutation = useMutation<
		unknown,
		AuthError,
		CredentialsUser
	>({
		mutationFn: async (data) => {
			await admin.updateUser({
				userId: data.id,
				data: { username: data.username, role: data.role },
			});
			await admin.setRole({ userId: data.id, role: data.role });
			await admin.setUserPassword({
				userId: data.id,
				newPassword: data.newPassword,
			});
		},
		onSettled: (_, error, vars) => {
			if (error) authErrorNotification(error);
			else {
				if (authedUser?.id === vars.id) refetch();
				closeEditCredentials();
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					const user = users.find((user) => user.id === vars.id);

					notifications.show({
						message: `Данные доступа учетной записи сотрудника "${user?.name}" изменены`,
						color: 'green',
					});
				});
			}
		},
	});

	const updateBlockMutation = useMutation<unknown, AuthError, BlockUser>({
		mutationFn: async (data) => {
			if (data.block) await admin.banUser({ userId: data.id });
			else await admin.unbanUser({ userId: data.id });
		},
		onSettled: (_, error, vars) => {
			if (error) authErrorNotification(error);
			else {
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

	const deleteMutation = useMutation<unknown, AuthError, string>({
		mutationFn: (data) => admin.removeUser({ userId: data }),
		onSettled: (_, error, vars) => {
			if (error) authErrorNotification(error);
			else {
				closeDelete();
				queryClient.invalidateQueries({ queryKey: ['users'] }).then(() => {
					const user = users.find((u) => u.id === vars);

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
		updateMutation,
		updateCredentialsMutation,
		updateBlockMutation,
		deleteMutation,
	};
};
