/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
//@ts-expect-error
import generatePassword from 'omgopass';
import z from 'zod/v4';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useUsers } from '../Provider';
import type { CreateUser } from '../types';

const schema = z.object({
	name: filedsSchema.name,
	email: filedsSchema.email,
	role: filedsSchema.role,
	username: filedsSchema.username,
	password: filedsSchema.password,
});

const defaultValues: CreateUser = {
	name: '',
	email: '',
	role: 'manager',
	username: '',
	password: generatePassword({
		minSyllableLength: 2,
		maxSyllableLength: 2,
	}),
};

export const Create = () => {
	const { users, createMutation, createOpened, openCreate, closeCreate } =
		useUsers();

	const form = useAppForm({
		defaultValues,
		validators: {
			onSubmit: schema
				.refine((data) => !users.some((user) => user.email === data.email), {
					message: 'Учетная запись с таким email уже существует',
					path: ['email'],
				})
				.refine(
					(data) => !users.some((user) => user.username === data.username),
					{
						message: 'Учетная запись с таким логином уже существует',
						path: ['username'],
					},
				),
		},
		onSubmitInvalid: blurOnError,
		onSubmit: ({ value }) => createMutation.mutateAsync(value),
	});

	return (
		<>
			<form.AppForm>
				<form.SubscribeButton
					label="Добавить"
					ml="auto"
					leftSection={<IconPlus size={20} />}
					onClick={() => {
						form.reset();
						openCreate();
					}}
				/>
			</form.AppForm>

			<Modal
				opened={createOpened}
				onClose={closeCreate}
				centered
				title="Добавление учетной записи сотрудника"
				padding="lg"
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
							name="password"
							children={(field) => <field.TextPassowrdField />}
						/>

						<Group ml="auto" mt="lg">
							<form.AppForm>
								<form.CancelButton onClick={closeCreate} />
							</form.AppForm>

							<form.AppForm>
								<form.SubmitButton
									label="Добавить"
									leftSection={<IconPlus size={20} />}
								/>
							</form.AppForm>
						</Group>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
