/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import { Group, Modal, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import z from 'zod/v4';
import type { CreateService } from '@/app';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useServices } from '../Provider';
import { CategoryField } from './CategoryField';

const schema = z.object({
	title: filedsSchema.title,
	category: z.string().min(1, 'Категория обязательна'),
});

const defaultValues: CreateService = {
	title: '',
	category: '',
};

export const Create = () => {
	const {
		createMutation,
		isArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
		isEditingCategory,
	} = useServices();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: async ({ value }) => {
			await createMutation.mutateAsync(value);
			notifications.show({
				message: `Услуга "${value.title}" создана`,
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
				closeOnEscape={!isEditingCategory}
				title="Добавление услуги"
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
