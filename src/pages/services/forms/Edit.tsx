/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { useEffect } from 'react';
import z from 'zod/v4';
import type { UpdateService } from '@/app';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useServices } from '../provider';
import { CategoryField } from './CategoryField';

const schema = z.object({
	id: filedsSchema.id,
	title: filedsSchema.title,
	category: z.string().min(1, 'Категория обязательна'),
});

const defaultValues: UpdateService = {
	id: '',
	title: '',
	category: '',
};

export const Edit = () => {
	const {
		updateMutation,
		selectedService,
		isEditingOpened,
		closeEdit,
		isEditingCategory,
		setIsEditingCategory,
	} = useServices();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await updateMutation.mutateAsync(value);
			closeForm();
		},
	});

	useEffect(() => {
		if (selectedService) {
			form.reset();
			form.setFieldValue('id', selectedService.id);
			form.setFieldValue('title', selectedService.title);
			form.setFieldValue('category', selectedService.category);
		}
	}, [form, selectedService]);

	const closeForm = () => {
		form.reset(selectedService as UpdateService, {
			keepDefaultValues: true,
		});
		setIsEditingCategory(false);
		closeEdit();
	};

	return (
		<Modal
			opened={isEditingOpened}
			onClose={closeForm}
			closeOnEscape={!isEditingCategory}
			title={`Изменение услуги ${selectedService?.title}`}
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

					<form.AppField name="category" children={() => <CategoryField />} />

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
