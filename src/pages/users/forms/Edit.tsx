/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect } from 'react';
import z from 'zod/v4';
import type { UpdateUser } from '@/app';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useUsers } from '../provider';

const schema = z.object({
	id: filedsSchema.id,
	name: filedsSchema.name,
	email: filedsSchema.email,
});

const defaultValues: UpdateUser = {
	id: '',
	name: '',
	email: '',
};

export const Edit = () => {
	const { selectedUser, users, editOpened, closeEdit, updateMutation } =
		useUsers();

	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: schema.refine(
				(data) =>
					!users
						.filter((i) => selectedUser?.id !== i.id)
						.some((user) => user.email === data.email),
				{
					message: 'Учетная запись с таким email уже существует',
					path: ['email'],
				},
			),
		},
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await updateMutation.mutateAsync(value);
			notifications.show({
				message: `Запись сотрудника "${value.name}" обновлена`,
				color: 'green',
			});
			closeForm();
		},
	});

	const resetForm = useCallback(() => {
		if (selectedUser) {
			form.setFieldValue('id', selectedUser.id);
			form.setFieldValue('name', selectedUser.name);
			form.setFieldValue('email', selectedUser.email);
		}
	}, [form, selectedUser]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const closeForm = () => {
		resetForm();
		closeEdit();
	};

	return (
		<Modal
			opened={editOpened}
			onClose={closeForm}
			title={`Изменение учетной записи сотрудника "${selectedUser?.name}"`}
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
						name="name"
						children={(field) => (
							<field.TextField label="Имя" placeholder="Введите имя" />
						)}
					/>

					<form.AppField
						name="email"
						children={(field) => (
							<field.TextField label="Email" placeholder="Введите email" />
						)}
					/>

					<Group ml="auto" mt="lg">
						<form.AppForm>
							<form.CancelButton onClick={closeForm} />
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
