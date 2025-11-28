/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useCallback, useEffect } from 'react';
import z from 'zod/v4';
import type { UpdatePrompt } from '@/types';
import { blurOnError, filedsSchema, useAppForm } from '~/ui';
import { usePrompts } from '../Provider';

const schema = z.object({
	id: filedsSchema.id,
	title: filedsSchema.title,
	service: z.string().min(1, 'Услуга обязательна'),
	model: z.string().min(1, 'Модель обязательна'),
});

const defaultValues: UpdatePrompt = {
	id: '',
	title: '',
	service: '',
	model: '',
};

export const Edit = () => {
	const {
		services,
		servicesWithPrompts,
		prompts,
		models,
		isEditingOpened,
		closeEdit,
		updateMutation,
		selectedPrompt,
	} = usePrompts();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			const prompt = prompts.find((p) => p.id === value.id);
			const serviceChanged = value.service !== prompt?.service;
			const willDisabled = servicesWithPrompts
				.find((i) => i.id === value.service)
				?.prompts.some((p) => p.enabled);
			let enabled = prompt?.enabled;

			if (enabled && serviceChanged && willDisabled) enabled = false;

			await updateMutation.mutateAsync({ ...value, enabled });

			notifications.show({
				message: `Промт "${value.title}" обновлен${enabled && serviceChanged && willDisabled ? ' и выключен' : ''}`,
				color: enabled && serviceChanged && willDisabled ? 'orange' : 'green',
			});
			closeForm();
		},
	});

	const resetForm = useCallback(() => {
		if (selectedPrompt) {
			form.setFieldValue('id', selectedPrompt.id);
			form.setFieldValue('title', selectedPrompt.title);
			form.setFieldValue('service', selectedPrompt.service);
			form.setFieldValue('model', selectedPrompt.model.id);
		}
	}, [form, selectedPrompt]);

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
			title={`Изменение настроек промта "${selectedPrompt?.title}"`}
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
