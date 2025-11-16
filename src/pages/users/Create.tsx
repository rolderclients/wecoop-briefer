import {
	Button,
	Group,
	Modal,
	PasswordInput,
	Stack,
	TextInput,
} from '@mantine/core';
import {
	hasLength,
	isEmail,
	isNotEmpty,
	matchesField,
	useForm,
} from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import { useUsers } from './Provider';

export const Create = () => {
	const { createUser, archived } = useUsers();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { name: '', email: '', password: '', confirmPassword: '' },
		validate: {
			name: isNotEmpty(),
			email: isEmail('Неверный формат email'),
			password: hasLength(
				{ min: 6 },
				'Пароль должен содержать не менее 6 символов',
			),
			confirmPassword: matchesField('password', 'Пароли не совпадают'),
		},
	});

	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button
				leftSection={<IconPlus size={20} />}
				disabled={archived}
				onClick={() => {
					form.reset();
					open();
				}}
			>
				Добавить
			</Button>

			<Modal opened={opened} onClose={close} centered title="Новая услуга">
				<form
					onSubmit={form.onSubmit((values) => {
						createUser({
							name: values.name,
							email: values.email,
							password: values.password,
						});
						close();
						notifications.show({
							message: `Сотрудник "${values.name}" добавлен`,
							color: 'green',
						});
					})}
				>
					<Stack>
						<TextInput
							label="Имя"
							placeholder="Введите имя"
							key={form.key('name')}
							{...form.getInputProps('name')}
						/>

						<TextInput
							label="Email"
							placeholder="Введите email"
							key={form.key('email')}
							{...form.getInputProps('email')}
						/>

						<PasswordInput
							label="Пароль"
							placeholder="Введите пароль"
							key={form.key('password')}
							{...form.getInputProps('password')}
						/>

						<PasswordInput
							label="Подтвердите пароль"
							placeholder="Подтвердите пароль"
							key={form.key('confirmPassword')}
							{...form.getInputProps('confirmPassword')}
						/>

						<Group ml="auto" mt="lg">
							<Button
								ml="auto"
								size="xs"
								variant="light"
								leftSection={<IconCancel size={16} />}
								onClick={close}
							>
								Отмена
							</Button>

							<Button
								size="xs"
								leftSection={<IconPlus size={20} />}
								type="submit"
							>
								Добавить
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
