/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Center, FocusTrap, Paper, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLogin2 } from '@tabler/icons-react';
import { useSearch } from '@tanstack/react-router';
import z from 'zod/v4';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useAuth } from './Provider';

const schema = z.object({
	username: filedsSchema.username,
	password: filedsSchema.password,
});

const defaultValues = {
	username: '',
	password: '',
};

export const Login = () => {
	const { redirect } = useSearch({ from: '/auth/login' });
	const { signIn } = useAuth();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			const result = await signIn({ ...value, redirect });

			if (result) {
				notifications.show({
					message: result.message,
					color: result.code === 'UNKNOWN_ERROR' ? 'red' : 'orange',
				});
			}
		},
	});

	return (
		<form
			id="form"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Center h="100vh">
				<Paper withBorder p="xl" radius="md">
					<Stack>
						<FocusTrap>
							<Stack miw={420}>
								<form.AppField
									name="username"
									children={(field) => (
										<field.TextField
											label="Логин"
											placeholder="Введите логин"
											size="lg"
										/>
									)}
								/>

								<form.AppField
									name="password"
									children={(field) => <field.PassowrdField />}
								/>
							</Stack>
						</FocusTrap>

						<form.AppForm>
							<form.SubmitButton
								ml="auto"
								mt="lg"
								size="lg"
								leftSection={<IconLogin2 />}
							/>
						</form.AppForm>
					</Stack>
				</Paper>
			</Center>
		</form>
	);
};
