import { Grid, Group, Paper, Switch, TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { IconArchive, IconRestore, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { Create } from '../forms';
import { useTasks } from '../Provider';
import { ArchivateRestoreDelete } from './ArchivateRestoreDelete';

export const Panel = () => {
	const { isArchived, setIsArchived, searchString, setSearchString } =
		useTasks();

	const [searchValue, setSearchValue] = useState(searchString);

	const handleSearch = useDebouncedCallback(async (query: string) => {
		setSearchString(query);
	}, 300);

	return (
		<Paper radius="md" withBorder py="sm" px="md">
			<Grid gutter="xs" overflow="hidden" align="center">
				<Grid.Col span="content">
					<Group wrap="nowrap">
						<Switch
							label="Архив"
							checked={isArchived}
							onChange={(e) => setIsArchived(e.currentTarget.checked)}
						/>

						{isArchived ? (
							<Group wrap="nowrap">
								<ArchivateRestoreDelete
									type="restore"
									label="Восстановить"
									icon={IconRestore}
								/>
								<ArchivateRestoreDelete
									type="delete"
									label="Удалить"
									icon={IconTrash}
									color="red"
								/>
							</Group>
						) : (
							<ArchivateRestoreDelete
								type="archivate"
								label="Архивировать"
								icon={IconArchive}
							/>
						)}
					</Group>
				</Grid.Col>

				<Grid.Col span="auto">
					<TextInput
						placeholder="Введите название задачи"
						value={searchValue}
						onChange={(event) => {
							setSearchValue(event.currentTarget.value);
							handleSearch(event.currentTarget.value);
						}}
					/>
				</Grid.Col>

				<Grid.Col span="content">
					<Create />
				</Grid.Col>
			</Grid>
		</Paper>
	);
};
