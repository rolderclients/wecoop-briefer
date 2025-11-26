/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import z from 'zod/v4';
import type { CreatePrompt } from '@/app';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { usePrompts } from '../Provider';

const schema = z.object({
	title: filedsSchema.title,
	service: z.string().min(1, 'Услуга обязательна'),
	model: z.string().min(1, 'Модель обязательна'),
});

const defaultValues: CreatePrompt = {
	title: '',
	service: '',
	model: '',
};

export const Create = () => {
	const {
		createMutation,
		isArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
		services,
		models,
	} = usePrompts();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await createMutation.mutateAsync(value);
			closeCreate();
			notifications.show({
				message: `Промт "${value.title}" добавлен`,
				color: 'green',
			});
		},
	});

	return (
		<>
			<form.AppForm>
				<form.SubscribeButton
					label="Добавить"
					ml="auto"
					disabled={isArchived}
					leftSection={<IconPlus size={20} />}
					onClick={() => {
						form.reset();
						openCreate();
					}}
				/>
			</form.AppForm>

			<Modal
				opened={isCreateOpened}
				onClose={closeCreate}
				title="Добавление промта"
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
							name="title"
							children={(field) => (
								<field.TextField
									label="Название"
									placeholder="Введите название"
								/>
							)}
						/>

						<form.AppField
							name="service"
							children={(field) => (
								<field.SelectField
									label="Услуга"
									placeholder="Выберите услугу"
									data={services.map((i) => ({ label: i.title, value: i.id }))}
									searchable
								/>
							)}
						/>

						<form.AppField
							name="model"
							children={(field) => (
								<field.SelectField
									label="Модель ИИ"
									placeholder="Выберите модель ИИ"
									data={models.map((i) => ({ label: i.title, value: i.id }))}
									searchable
								/>
							)}
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
