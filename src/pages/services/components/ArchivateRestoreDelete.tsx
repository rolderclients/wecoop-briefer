import { Button, Group, type MantineColor, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { type Icon, IconCancel } from '@tabler/icons-react';
import { useServices } from '../provider';

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
	const {
		services,
		updateManyMutation,
		deleteManyMutation,
		selectedIds,
		setSelectedIds,
	} = useServices();
	const [opened, { open, close }] = useDisclosure(false);

	return (
		<>
			<Button
				size="xs"
				variant="light"
				color={color}
				leftSection={<Icon size={16} />}
				disabled={!selectedIds.length || updateManyMutation.isPending}
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
						disabled={updateManyMutation.isPending}
					>
						Отмена
					</Button>

					<Button
						size="xs"
						color={color}
						leftSection={<Icon size={16} />}
						rightSection={selectedIds.length}
						loading={updateManyMutation.isPending}
						onClick={async () => {
							const selected = services.filter((i) =>
								selectedIds.includes(i.id),
							);

							switch (type) {
								case 'archivate':
									{
										await updateManyMutation.mutateAsync(
											selected.map((i) => ({ id: i.id, archived: true })),
										);
										notifications.show({
											message:
												selected.length === 1
													? `Услуга архивирована`
													: `Услуги архивированы`,
											color: 'green',
										});
									}
									break;
								case 'restore':
									{
										await updateManyMutation.mutateAsync(
											selected.map((i) => ({ id: i.id, archived: false })),
										);
										notifications.show({
											message:
												selected.length === 1
													? `Услуга восстановлена`
													: `Услуги восстановлены`,
											color: 'green',
										});
									}
									break;
								case 'delete':
									{
										await deleteManyMutation.mutateAsync(selectedIds);
										notifications.show({
											message:
												selected.length === 1
													? `Услуга удалена`
													: `Услуги удалены`,
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
