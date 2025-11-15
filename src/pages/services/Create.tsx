import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import { useServices } from './Provider';

export const Create = () => {
	const { categories, createService, archived } = useServices();

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: { title: '', category: '' },
		validate: { title: isNotEmpty(), category: isNotEmpty() },
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
						createService({ title: values.title, category: values.category });
						close();
						notifications.show({
							message: `Услуга "${values.title}" создана`,
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
								Добавить
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</>
	);
};
