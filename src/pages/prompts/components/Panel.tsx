import { Group, Paper, Switch } from '@mantine/core';
import { IconArchive, IconRestore, IconTrash } from '@tabler/icons-react';
import { Create } from '../forms';
import { usePrompts } from '../Provider';
import { ArchivateRestoreDelete } from './ArchivateRestoreDelete';

export const Panel = () => {
	const { isArchived, setIsArchived } = usePrompts();

	return (
		<Paper radius="md" withBorder py="sm" px="md">
			<Group wrap="nowrap" justify="space-between">
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

				<Create />
			</Group>
		</Paper>
	);
};
