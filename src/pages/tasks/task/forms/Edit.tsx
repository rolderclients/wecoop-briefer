/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import z from 'zod/v4';
import { servicesWithEnbledPromptsQueryOptions, updateTaskFn } from '@/back';
import { useMutaitionWithInvalidate } from '@/front';
import type { Task, UpdateTask } from '@/types';
import { blurOnError, filedsSchema, useAppForm } from '~/ui';

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

interface EditProps {
	opened: boolean;
	task: Task;
	// services?: Array<{ id: string; title: string }>; // Добавь свой тип сервисов
	onClose: () => void;
	// updateMutation?: any; // Замени на правильный тип мутации
}

const defaultValues: UpdateTask = {
	id: '',
	title: '',
	service: '',
};

export const Edit = ({ opened, task, onClose }: EditProps) => {
	// Получаем все доступные услуги
	const { data: services } = useSuspenseQuery(
		servicesWithEnbledPromptsQueryOptions(),
	);

	const updateMutation = useMutaitionWithInvalidate<UpdateTask>(updateTaskFn, [
		'tasks',
	]);

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
		if (task) {
			form.setFieldValue('id', task.id);
			form.setFieldValue('title', task.title);
			form.setFieldValue('content', task.content);
			form.setFieldValue('company', task.company);
			form.setFieldValue('service', task.service.id);
		}
	}, [form, task]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	const closeForm = () => {
		resetForm();
		onClose();
	};

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title={`Изменение задачи "${task?.title}"`}
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
								data={services?.map((i) => ({ label: i.title, value: i.id }))}
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
