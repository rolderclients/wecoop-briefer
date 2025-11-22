import {
	Button,
	Center,
	FocusTrap,
	Group,
	Paper,
	PasswordInput,
	Stack,
	Switch,
	Text,
	TextInput,
} from '@mantine/core';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconLogin2, IconLogout2 } from '@tabler/icons-react';
import { useAuth } from './auth';

export const TestAuth = () => {
	const { user, authed, signIn, signOut, loading } = useAuth();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { username: '', password: '' },
		validate: {
			username: isNotEmpty(),
			password: hasLength(
				{ min: 8 },
				'Пароль должен содержать не менее 8 символов',
			),
		},
	});

	return (
		<form
			onSubmit={form.onSubmit(
				async (values) => {
					const result = await signIn({ ...values });

					if (result) {
						notifications.show({
							message: result.message,
							color: result.code === 'UNKNOWN_ERROR' ? 'red' : 'orange',
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
						<Text>{user?.name}</Text>
						<Text>{user?.email}</Text>
						<Switch checked={authed} />

						<FocusTrap>
							<Stack miw={420}>
								<TextInput
									size="lg"
									label="Логин"
									placeholder="Введите логин"
									key={form.key('username')}
									{...form.getInputProps('username')}
								/>

								<PasswordInput
									size="lg"
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
								disabled={loading || !authed}
								leftSection={<IconLogout2 />}
								onClick={signOut}
							>
								Выйти
							</Button>

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
