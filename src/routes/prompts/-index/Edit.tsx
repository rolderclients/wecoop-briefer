import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCancel, IconPlus } from '@tabler/icons-react';
import type { FormPrompt } from '@/api';
import { usePrompts } from './PromptsProvider';

export const Edit = ({
	form,
	opened,
	close,
}: {
	form: UseFormReturnType<FormPrompt>;
	opened: boolean;
	close: () => void;
}) => {
	const { services, servicesWithPrompts, prompts, models, updatePrompt } =
		usePrompts();

	return (
		<Modal
			opened={opened}
			onClose={close}
			centered
			title={form.getInitialValues().title}
		>
			<form
				onSubmit={form.onSubmit((values) => {
					const prompt = prompts.find((p) => p.id === values.id);
					const serviceChanged = values.service !== prompt?.service;
					const willDisabled = servicesWithPrompts
						.find((i) => i.id === values.service)
						?.prompts.some((p) => p.enabled);
					let enabled = prompt?.enabled;

					if (enabled && serviceChanged && willDisabled) enabled = false;

					updatePrompt({ ...values, enabled });

					close();
					notifications.show({
						message: `Промт "${values.title}" обновлен${enabled && serviceChanged && willDisabled ? ' и выключен' : ''}`,
						color:
							enabled && serviceChanged && willDisabled ? 'orange' : 'green',
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
						label="Услуга"
						placeholder="Выберите услугу"
						data={services.map((i) => ({ label: i.title, value: i.id }))}
						searchable
						key={form.key('service')}
						{...form.getInputProps('service')}
					/>

					<Select
						label="Модель ИИ"
						placeholder="Выберите модель ИИ"
						data={models.map((i) => ({ label: i.title, value: i.id }))}
						searchable
						key={form.key('model')}
						{...form.getInputProps('model')}
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
