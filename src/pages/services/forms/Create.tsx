/** biome-ignore-all lint/correctness/noChildrenProp: <> */
import {
	Combobox,
	Group,
	InputBase,
	Modal,
	Stack,
	useCombobox,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
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

// const groceries = [
// 	'🍎 Apples',
// 	'🍌 Bananas',
// 	'🥦 Broccoli',
// 	'🥕 Carrots',
// 	'🍫 Chocolate',
// 	'🍇 Grapes',
// ];

const CreateNewService = () => {
	const { categories, createCategoryMutation } = useServices();

	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	// const [data, setData] = useState(groceries);
	const [value, setValue] = useState<string | null>(null);
	const [search, setSearch] = useState('');

	const exactOptionMatch = categories.some((item) => item.title === search);
	const filteredOptions = exactOptionMatch
		? categories
		: categories.filter((item) =>
				item.title.toLowerCase().includes(search.toLowerCase().trim()),
			);

	const options = filteredOptions.map((item) => (
		<Combobox.Option value={item.title} key={item.id}>
			{item.title}
		</Combobox.Option>
	));

	return (
		<Combobox
			store={combobox}
			withinPortal={true}
			onOptionSubmit={async (val) => {
				if (val === '$create') {
					// setData((current) => [...current, search]);
					await createCategoryMutation.mutateAsync({ title: search });
					setValue(search);
				} else {
					setValue(val);
					setSearch(val);
				}

				combobox.closeDropdown();
			}}
		>
			<Combobox.Target>
				<InputBase
					rightSection={<Combobox.Chevron />}
					value={search}
					onChange={(event) => {
						combobox.openDropdown();
						combobox.updateSelectedOptionIndex();
						setSearch(event.currentTarget.value);
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => {
						combobox.closeDropdown();
						setSearch(value || '');
					}}
					placeholder="Search value"
					rightSectionPointerEvents="none"
				/>
			</Combobox.Target>

			<Combobox.Dropdown>
				<Combobox.Options>
					{options}
					{!exactOptionMatch && search.trim().length > 0 && (
						<Combobox.Option value="$create">
							+ Создать {search}
						</Combobox.Option>
					)}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
};
