import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	type AuthError,
	admin,
	authErrorNotification,
	type BlockUser,
	type CreateUser,
	type CredentialsUser,
	type UpdateUser,
	useAuth,
} from '@/front';

export const useMutations = () => {
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
		onSettled: async (_, error) => {
			if (error) authErrorNotification(error);
			else await queryClient.invalidateQueries({ queryKey: ['users'] });
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
		onSettled: async (_, error, vars) => {
			if (error) authErrorNotification(error);
			else {
				if (authedUser?.id === vars.id) refetch();
				await queryClient.invalidateQueries({ queryKey: ['users'] });
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
		onSettled: async (_, error, vars) => {
			if (error) authErrorNotification(error);
			else {
				if (authedUser?.id === vars.id) refetch();
				await queryClient.invalidateQueries({ queryKey: ['users'] });
			}
		},
	});

	const updateBlockMutation = useMutation<unknown, AuthError, BlockUser>({
		mutationFn: async (data) => {
			if (data.block) await admin.banUser({ userId: data.id });
			else await admin.unbanUser({ userId: data.id });
		},
		onSettled: async (_, error) => {
			if (error) authErrorNotification(error);
			else await queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});

	const deleteMutation = useMutation<unknown, AuthError, string>({
		mutationFn: (data) => admin.removeUser({ userId: data }),
		onSettled: async (_, error) => {
			if (error) authErrorNotification(error);
			else await queryClient.invalidateQueries({ queryKey: ['users'] });
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
