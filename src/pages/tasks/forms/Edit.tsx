/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect } from 'react';
import z from 'zod/v4';
import type { UpdateTask } from '@/types';
import { blurOnError, filedsSchema, useAppForm } from '~/ui';
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

const defaultValues: UpdateTask = {
	id: '',
	title: '',
	service: '',
};

export const Edit = () => {
	const { services, isEditingOpened, closeEdit, updateMutation, selectedTask } =
		useTasks();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await updateMutation.mutateAsync(value);
			notifications.show({
				message: `Задача "${value.title}" обновлена`,
				color: 'green',
			});
			closeForm();
		},
	});

	const resetForm = useCallback(() => {
		if (selectedTask) {
			form.setFieldValue('id', selectedTask.id);
			form.setFieldValue('title', selectedTask.title);
			form.setFieldValue('content', selectedTask.content);
			form.setFieldValue('company', selectedTask.company);
			form.setFieldValue('service', selectedTask.service.id);
		}
	}, [form, selectedTask]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const closeForm = () => {
		resetForm();
		closeEdit();
	};

	return (
		<Modal
			opened={isEditingOpened}
			onClose={closeForm}
			title={`Изменение задачи "${selectedTask?.title}"`}
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
							<form.CancelButton onClick={closeForm} />
						</form.AppForm>

						<form.AppForm>
							<form.SubmitButton />
						</form.AppForm>
					</Group>
				</Stack>
			</form>
		</Modal>
	);
};
