import { Group, Paper, Switch } from '@mantine/core';
import { IconArchive, IconRestore, IconTrash } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { Route } from '@/routes/_authed/services';
import { Create } from './forms/Create';
import { useServices } from './Provider';

export const Panel = () => {
	const navigate = useNavigate({ from: Route.fullPath });

	const { setSelectedIds, isArchived, setIsArchived } = useServices();

	return (
		<Paper radius="md" withBorder py="sm" px="md">
			<Group wrap="nowrap" justify="space-between">
				<Group wrap="nowrap">
					<Switch
						label="Архив"
						checked={isArchived}
						onChange={(e) => {
							setIsArchived(e.currentTarget.checked);
							navigate({
								search: () => ({ archived: e.currentTarget.checked }),
							});
							setSelectedIds([]);
						}}
					/>

					{/*{archived ? (
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
					)}*/}
				</Group>

				<Create />
			</Group>
		</Paper>
	);
};
