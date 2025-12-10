/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Accordion, Group, Modal, Stack, Switch } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { revalidateLogic } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import z from 'zod/v4';
import type { CredentialsUser } from '@/front';
import { blurOnError, filedsSchema, useAppForm } from '~/ui';
import { useUsers } from '../provider';
import classes from './switch.module.css';

const schema = z.object({
	id: filedsSchema.id,
	role: filedsSchema.role,
	username: filedsSchema.username,
	newPassword: filedsSchema.password.optional(),
});

const defaultValues: CredentialsUser = {
	id: '',
	role: 'manager',
	username: '',
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
		validationLogic: revalidateLogic(),
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
			closeForm();
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

	const [passwordWillChange, setPasswordWillChange] = useState(false);

	const closeForm = () => {
		setPasswordWillChange(false);
		form.setFieldValue('newPassword', undefined);
		closeEditCredentials();
	};

	return (
		<Modal
			opened={editCredentialsOpened}
			onClose={closeForm}
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

					<Accordion
						variant="separated"
						mt="sm"
						onChange={() => setPasswordWillChange((p) => !p)}
						onClick={(e) => e.preventDefault()}
					>
						<Accordion.Item value="pass">
							<Accordion.Control>
								<Switch
									color="orange"
									label="Установить новый пароль"
									checked={passwordWillChange}
									readOnly
									classNames={{
										body: classes.pointer,
										track: classes.pointer,
										labelWrapper: classes.pointer,
										label: classes.pointer,
									}}
								/>
							</Accordion.Control>
							<Accordion.Panel>
								<form.AppField
									name="newPassword"
									validators={{
										onDynamic: passwordWillChange
											? filedsSchema.password
											: undefined,
									}}
									children={(field) => (
										<field.TextPassowrdField
											label="Новый пароль"
											placeholder="Введите новый пароль"
										/>
									)}
								/>
							</Accordion.Panel>
						</Accordion.Item>
					</Accordion>

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
