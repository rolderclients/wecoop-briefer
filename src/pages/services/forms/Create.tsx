/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import {
	ActionIcon,
	Combobox,
	Group,
	InputBase,
	Loader,
	Modal,
	Stack,
	Text,
	useCombobox,
} from '@mantine/core';
import { IconCheck, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { useState } from 'react';
import z from 'zod/v4';
import type { CreateService } from '@/app';
import { blurOnError, filedsSchema, useAppForm } from '@/components';
import { useServices } from '../Provider';

const schema = z.object({
	title: filedsSchema.title,
	category: z.string(),
});

const defaultValues: CreateService = {
	title: '',
	category: '',
};

export const Create = () => {
	const {
		categories,
		createMutation,
		archived,
		createOpened,
		openCreate,
		closeCreate,
		isEditingCategory,
	} = useServices();

	const form = useAppForm({
		defaultValues,
		validators: { onSubmit: schema },
		onSubmitInvalid: blurOnError,
		onSubmit: ({ value }) => createMutation.mutateAsync(value),
	});

	return (
		<>
			<form.AppForm>
				<form.SubscribeButton
					label="Добавить"
					ml="auto"
					disabled={archived}
					leftSection={<IconPlus size={20} />}
					onClick={() => {
						form.reset();
						openCreate();
					}}
				/>
			</form.AppForm>

			<Modal
				opened={createOpened}
				onClose={closeCreate}
				closeOnEscape={!isEditingCategory}
				centered
				title="Добавление услуги"
				padding="lg"
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
								<field.TextField label="Имя" placeholder="Введите имя" />
							)}
						/>

						<form.AppField
							name="category"
							children={(field) => <CreateNewService />}
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

const CreateNewService = () => {
	const {
		categories,
		createCategoryMutation,
		updateCategoryMutation,
		isEditingCategory,
		setIsEditingCategory,
	} = useServices();
	const [creating, setCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingText, setEditingText] = useState('');
	const [editingLoading, setEditingLoading] = useState(false);

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [value, setValue] = useState<string | null>(null);
	const [search, setSearch] = useState('');

	const exactOptionMatch = categories.some((item) => item.title === search);
	const filteredOptions = exactOptionMatch
		? categories
		: categories.filter((item) =>
				item.title.toLowerCase().includes(search.toLowerCase().trim()),
			);

	const handleStartEdit = (item: { id: string; title: string }) => {
		setEditingId(item.id);
		setEditingText(item.title);
		setIsEditingCategory(true);
		setSearch(item.title);
		combobox.closeDropdown();
	};

	const handleSaveEdit = async () => {
		if (editingId && editingText.trim()) {
			setEditingLoading(true);
			await updateCategoryMutation.mutateAsync({
				id: editingId,
				title: editingText,
			});
			setEditingLoading(false);
			setValue(editingText);
			setSearch(editingText);
		}
		setEditingId(null);
		setEditingText('');
		setIsEditingCategory(false);
	};

	const handleCancelEdit = () => {
		const originalTitle =
			categories.find((c) => c.id === editingId)?.title || '';
		setValue(originalTitle);
		setSearch(originalTitle);
		setEditingId(null);
		setEditingText('');
		setIsEditingCategory(false);
	};

	const options = filteredOptions.map((item) => (
		<Combobox.Option value={item.title} key={item.id}>
			<Group gap={8} justify="space-between">
				<Text inline size="sm">
					{item.title}
				</Text>
				<ActionIcon
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						handleStartEdit(item);
					}}
				>
					<IconEdit size={16} />
				</ActionIcon>
			</Group>
		</Combobox.Option>
	));

	return (
		<Combobox
			store={combobox}
			withinPortal={true}
			onOptionSubmit={async (val) => {
				if (val === '$create') {
					setCreating(true);
					await createCategoryMutation.mutateAsync({ title: search });
					setValue(search);
					setCreating(false);
				} else {
					setValue(val);
					setSearch(val);
				}

				combobox.closeDropdown();
			}}
		>
			<Combobox.Target>
				<InputBase
					rightSection={
						creating || editingLoading ? (
							<Loader size="sm" />
						) : isEditingCategory ? (
							<Group gap={4} wrap="nowrap">
								<ActionIcon size="sm" color="green" onClick={handleSaveEdit}>
									<IconCheck size={16} />
								</ActionIcon>
								<ActionIcon size="sm" color="red" onClick={handleCancelEdit}>
									<IconX size={16} />
								</ActionIcon>
							</Group>
						) : (
							<Combobox.Chevron />
						)
					}
					rightSectionWidth={
						isEditingCategory && !editingLoading ? 64 : undefined
					}
					value={isEditingCategory ? editingText : search}
					onChange={(event) => {
						if (isEditingCategory) {
							setEditingText(event.currentTarget.value);
						} else {
							combobox.openDropdown();
							combobox.updateSelectedOptionIndex();
							setSearch(event.currentTarget.value);
						}
					}}
					onKeyDown={
						isEditingCategory
							? (e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										e.stopPropagation();
										handleSaveEdit();
									} else if (e.key === 'Escape') {
										e.preventDefault();
										e.stopPropagation();
										handleCancelEdit();
									}
								}
							: undefined
					}
					onClick={() => !isEditingCategory && combobox.openDropdown()}
					onFocus={() => !isEditingCategory && combobox.openDropdown()}
					onBlur={() => {
						if (!isEditingCategory) {
							combobox.closeDropdown();
							setSearch(value || '');
						}
					}}
					label="Категория"
					placeholder={
						isEditingCategory
							? 'Редактирование категории...'
							: 'Выберите категорию'
					}
					rightSectionPointerEvents={isEditingCategory ? 'auto' : 'none'}
				/>
			</Combobox.Target>

			<Combobox.Dropdown>
				<Combobox.Options>
					{options}
					{!exactOptionMatch && search.trim().length > 0 && (
						<Combobox.Option value="$create">
							<Group gap={8}>
								<IconPlus size={16} />
								<Text inline size="sm">
									Создать категорию "{search}"
								</Text>
							</Group>
						</Combobox.Option>
					)}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
};
