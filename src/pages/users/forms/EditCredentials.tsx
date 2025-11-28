/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
//@ts-expect-error
import generatePassword from 'omgopass';
import { useEffect } from 'react';
import z from 'zod/v4';
import type { CredentialsUser } from '@/front';
import { blurOnError, filedsSchema, useAppForm } from '~/ui';
import { useUsers } from '../provider';

const schema = z.object({
	id: filedsSchema.id,
	role: filedsSchema.role,
	username: filedsSchema.username,
	newPassword: filedsSchema.password,
});

const defaultValues: CredentialsUser = {
	id: '',
	role: 'manager',
	username: '',
	newPassword: generatePassword({
		minSyllableLength: 2,
		maxSyllableLength: 2,
	}),
};

export const EditCredentials = () => {
	const {
		selectedUser,
		users,
		editCredentialsOpened,
		closeEditCredentials,
		updateCredentialsMutation,
	} = useUsers();

	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: schema.refine(
				(data) =>
					!users
						.filter((i) => selectedUser?.id !== i.id)
						.some((user) => user.username === data.username),
				{
					message: 'Учетная запись с таким логином уже существует',
					path: ['username'],
				},
			),
		},
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await updateCredentialsMutation.mutateAsync(value);
			closeEditCredentials();
			notifications.show({
				message: `Данные доступа учетной записи сотрудника "${selectedUser?.name}" изменены`,
				color: 'green',
			});
		},
	});

	useEffect(() => {
		if (selectedUser) {
			form.reset();
			form.setFieldValue('id', selectedUser.id);
			form.setFieldValue('role', selectedUser.role);
			form.setFieldValue('username', selectedUser.username);
		}
	}, [form, selectedUser]);

	return (
		<Modal
			opened={editCredentialsOpened}
			onClose={closeEditCredentials}
			title={`Изменение данных доступа сотрудника "${selectedUser?.name}"`}
		>
			<form
				id="form"
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<Stack>
					<form.AppField
						name="role"
						children={(field) => (
							<field.SelectField
								label="Роль"
								allowDeselect={false}
								data={[
									{ value: 'manager', label: 'Менеджер (только задачи)' },
									{ value: 'admin', label: 'Администратор (полный доступ)' },
								]}
							/>
						)}
					/>

					<form.AppField
						name="username"
						children={(field) => (
							<field.TextField label="Логин" placeholder="Введите логин" />
						)}
					/>

					<form.AppField
						name="newPassword"
						children={(field) => (
							<field.TextPassowrdField
								label="Новый пароль"
								placeholder="Введите новый пароль"
							/>
						)}
					/>

					<Group ml="auto" mt="lg">
						<form.AppForm>
							<form.CancelButton onClick={closeEditCredentials} />
						</form.AppForm>

						<form.AppForm>
							<form.SubmitButton />
						</form.AppForm>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
};
