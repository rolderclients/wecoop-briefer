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
import { useCallback, useEffect, useState } from 'react';
import z from 'zod/v4';
import type { CreateService } from '@/app';
import {
	blurOnError,
	filedsSchema,
	useAppForm,
	useFieldContext,
} from '@/components';
import { useServices } from '../Provider';

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
		onSubmit: ({ value }) => createMutation.mutateAsync(value),
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
							children={() => <CreateNewService />}
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
	const field = useFieldContext<string>();
	const {
		categories,
		createCategoryMutation,
		updateCategoryMutation,
		isEditingCategory,
		setIsEditingCategory,
	} = useServices();

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [value, setValue] = useState<string | null>(null);
	const [search, setSearch] = useState('');
	const [creating, setCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingText, setEditingText] = useState('');
	const [editingLoading, setEditingLoading] = useState(false);

	const exactOptionMatch = categories.some((item) => item.title === search);
	const filteredOptions = exactOptionMatch
		? categories
		: categories.filter((item) =>
				item.title.toLowerCase().includes(search.toLowerCase().trim()),
			);

	const handleStartEdit = useCallback(
		(item: { id: string; title: string }) => {
			setEditingId(item.id);
			setEditingText(item.title);
			setIsEditingCategory(true);
			setSearch(item.title);
			combobox.closeDropdown();
		},
		[setIsEditingCategory, combobox],
	);

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
			// Update form with category ID
			const updatedCategory = categories.find((c) => c.id === editingId);
			if (updatedCategory) {
				field.handleChange(updatedCategory.id);
			}
		}
		setEditingId(null);
		setEditingText('');
		setIsEditingCategory(false);
	};

	const handleCancelEdit = () => {
		const originalCategory = categories.find((c) => c.id === editingId);
		if (originalCategory) {
			setValue(originalCategory.title);
			setSearch(originalCategory.title);
			field.handleChange(originalCategory.id);
		}
		setEditingId(null);
		setEditingText('');
		setIsEditingCategory(false);
	};

	// Handle keyboard shortcuts for editing
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Only handle shortcuts when not already editing and dropdown is closed
			if (!isEditingCategory && !combobox.dropdownOpened) {
				if (
					(e.key === 'F2' || (e.ctrlKey && e.key === 'Enter')) &&
					exactOptionMatch
				) {
					e.preventDefault();
					// Find the category that matches the current search
					const categoryToEdit = categories.find((c) => c.title === search);
					if (categoryToEdit) {
						handleStartEdit(categoryToEdit);
					}
				}
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [
		isEditingCategory,
		combobox.dropdownOpened,
		categories,
		search,
		exactOptionMatch,
		handleStartEdit,
	]);

	const options = filteredOptions.map((item) => (
		<Combobox.Option value={item.title} key={item.id}>
			<Group gap={8} justify="space-between">
				<Text inline size="sm">
					{item.title}
				</Text>
				<ActionIcon
					size="sm"
					variant="default"
					onClick={(e) => {
						e.stopPropagation();
						handleStartEdit(item);
					}}
				>
					<IconEdit size={16} strokeWidth={1.5} />
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
					field.handleChange(search);
					setCreating(false);
				} else {
					// Find category by title and set its ID
					const selectedCategory = categories.find((c) => c.title === val);
					if (selectedCategory) {
						setValue(val);
						setSearch(val);
						field.handleChange(selectedCategory.id);
					}
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
							<Group gap={8} wrap="nowrap">
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
						isEditingCategory && !editingLoading ? 68 : undefined
					}
					value={isEditingCategory ? editingText : search}
					error={
						field.state.meta.errors.map((err) => err.message).join(', ') ||
						undefined
					}
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
							if (exactOptionMatch) {
								// If there's an exact match, update form field with category ID
								const matchedCategory = categories.find(
									(c) => c.title === search,
								);
								if (matchedCategory) {
									field.handleChange(matchedCategory.id);
								}
								setSearch(value || search);
							} else {
								setSearch(value || '');
								field.handleChange('');
							}
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
