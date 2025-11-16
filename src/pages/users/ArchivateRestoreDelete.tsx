import { Button, Group, type MantineColor, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { type Icon, IconCancel } from '@tabler/icons-react';
import { useUsers } from './Provider';

export const ArchivateRestoreDelete = ({
	type,
	label,
	icon: Icon,
	color,
}: {
	type: 'archivate' | 'restore' | 'delete';
	label: string;
	icon: Icon;
	color?: MantineColor;
}) => {
	const { users, updateUsers, deleteUsers, selectedIds, setSelectedIds } =
		useUsers();
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button
				size="xs"
				variant="light"
				color={color}
				leftSection={<Icon size={16} />}
				disabled={!selectedIds.length}
				rightSection={selectedIds.length > 0 ? selectedIds.length : null}
				onClick={open}
			>
				{label}
			</Button>

			<Modal opened={opened} onClose={close} centered withCloseButton={false}>
				<Group>
					<Text>Уверены?</Text>

					<Button
						ml="auto"
						size="xs"
						variant="light"
						leftSection={<IconCancel size={16} />}
						onClick={close}
					>
						Отмена
					</Button>

					<Button
						size="xs"
						color={color}
						leftSection={<Icon size={16} />}
						rightSection={selectedIds.length}
						onClick={() => {
							const selected = users.filter((i) => selectedIds.includes(i.id));
							const toBlockCount = selected.filter((i) => !i.blocked).length;

							switch (type) {
								case 'archivate':
									{
										updateUsers(
											selected.map((i) => ({
												id: i.id,
												archived: true,
												blocked: true,
											})),
										);
										notifications.show({
											message:
												selected.length === 1
													? toBlockCount
														? `Запись сотрудника архивирована и заблокирована`
														: `Запись сотрудника архивирована`
													: toBlockCount
														? `Записи сотрудников архивированы и заблокированы`
														: `Записи сотрудников архивированы`,
											color: toBlockCount ? 'orange' : 'green',
										});
									}
									break;
								case 'restore':
									{
										updateUsers(
											selected.map((i) => ({ id: i.id, archived: false })),
										);
										notifications.show({
											message:
												selected.length === 1
													? `Запись сотрудника восстановлена`
													: `Записи сотрудников восстановлены`,
											color: 'green',
										});
									}
									break;
								case 'delete':
									{
										deleteUsers(selectedIds);
										notifications.show({
											message:
												selected.length === 1
													? `Запись сотрудника удалена`
													: `Записи сотрудников удалены`,
											color: 'green',
										});
									}
									break;
							}
							setSelectedIds([]);
							close();
						}}
					>
						{label}
					</Button>
				</Group>
			</Modal>
		</>
	);
};
