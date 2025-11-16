import {
	Button,
	Group,
	Modal,
	PasswordInput,
	Stack,
	TextInput,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import type { FormUser } from '@/api';
import { useUsers } from './Provider';

export const Edit = ({
	form,
	opened,
	close,
}: {
	form: UseFormReturnType<FormUser>;
	opened: boolean;
	close: () => void;
}) => {
	const { updateUser } = useUsers();

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title={form.getInitialValues().name}
		>
			<form
				onSubmit={form.onSubmit((values) => {
					const { confirmPassword: _, ...rest } = values;
					updateUser(rest);
					close();
					notifications.show({
						message: `Запись сотрудника "${values.name}" обновлена`,
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
							Сохранить
						</Button>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
};
