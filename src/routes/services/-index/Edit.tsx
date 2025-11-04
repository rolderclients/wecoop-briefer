import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import type { FormService } from '@/api';
import { useServices } from './ServicesProvider';

export const Edit = ({
	form,
	opened,
	close,
}: {
	form: UseFormReturnType<FormService>;
	opened: boolean;
	close: () => void;
}) => {
	const { categories, updateService } = useServices();

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title={form.getInitialValues().title}
		>
			<form
				onSubmit={form.onSubmit((values) => {
					updateService(values);
					close();
					notifications.show({
						message: `Услуга "${values.title}" обновлена`,
						color: 'green',
					});
				})}
			>
				<Stack>
					<TextInput
						label="Название"
						placeholder="Введите название"
						key={form.key('title')}
						{...form.getInputProps('title')}
					/>

					<Select
						label="Категория"
						placeholder="Выберите категорию"
						data={categories.map((i) => ({ label: i.title, value: i.id }))}
						searchable
						key={form.key('category')}
						{...form.getInputProps('category')}
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
