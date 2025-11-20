import {
	Button,
	Center,
	FocusTrap,
	Group,
	Paper,
	PasswordInput,
	Stack,
	TextInput,
} from '@mantine/core';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconLogin2 } from '@tabler/icons-react';
import { useSearch } from '@tanstack/react-router';

import { useAuth } from './Provider';

export const Login = () => {
	const { redirect } = useSearch({ from: '/login' });
	const { login, loading } = useAuth();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { email: '', password: '' },
		validate: {
			email: isNotEmpty(),
			password: hasLength(
				{ min: 6 },
				'Пароль должен содержать не менее 6 символов',
			),
		},
	});

	return (
		<form
			onSubmit={form.onSubmit(
				async (values) => {
					const result = await login({ ...values, redirect });

					if (result?.error) {
						notifications.show({
							message: result.error,
							color: result.unknownError ? 'red' : 'orange',
						});
					}
				},
				(errors) => {
					const firstErrorPath = Object.keys(errors)[0];
					form.getInputNode(firstErrorPath)?.focus();
				},
			)}
		>
			<Center h="100vh">
				<Paper withBorder p="xl" radius="md">
					<Stack>
						<FocusTrap>
							<Stack miw={420}>
								<TextInput
									size="xl"
									label="Почта"
									placeholder="Введите почту"
									key={form.key('email')}
									{...form.getInputProps('email')}
								/>

								<PasswordInput
									size="xl"
									label="Пароль"
									placeholder="Введите пароль"
									key={form.key('password')}
									{...form.getInputProps('password')}
								/>
							</Stack>
						</FocusTrap>

						<Group ml="auto" mt="lg">
							<Button
								size="lg"
								loading={loading}
								leftSection={<IconLogin2 />}
								type="submit"
							>
								Войти
							</Button>
						</Group>
					</Stack>
				</Paper>
			</Center>
		</form>
	);
};
