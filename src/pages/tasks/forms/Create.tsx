/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import z from 'zod/v4';
import type { CreateTask } from '@/app';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useTasks } from '../Provider';

const schema = z.object({
	title: filedsSchema.title,
	content: z.string().optional(),
	company: z
		.object({
			title: z.string().optional(),
			info: z.string().optional(),
		})
		.optional(),
	service: z.string().min(1, 'Услуга обязательна'),
});

const defaultValues: CreateTask = {
	title: '',
	service: '',
};

export const Create = () => {
	const {
		services,
		createMutation,
		isArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
	} = useTasks();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await createMutation.mutateAsync(value);
			closeCreate();
			notifications.show({
				message: `Задача "${value.title}" создана`,
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
				title="Добавление задачи"
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
							name="content"
							children={(field) => (
								<field.TextField
									label="Описание"
									placeholder="Введите описание"
								/>
							)}
						/>

						<form.AppField
							name="company.title"
							children={(field) => (
								<field.TextField
									label="Название компании"
									placeholder="Введите название компании"
								/>
							)}
						/>

						<form.AppField
							name="company.info"
							children={(field) => (
								<field.TextField
									label="Информация о компании"
									placeholder="Введите информацию о компании"
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
