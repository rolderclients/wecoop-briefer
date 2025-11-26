import { Button, Group, type MantineColor, Modal, Text } from '@mantine/core';
import { IconCancel, IconCheck } from '@tabler/icons-react';

export const ConfirmModal = ({
	content = 'Уверены?',
	buttonLabel,
	color,
	opened,
	onClose,
	onConfirm,
	loading,
}: {
	content?: string;
	buttonLabel: string;
	color?: MantineColor;
	opened: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading?: boolean;
}) => {
	return (
		<Modal opened={opened} onClose={onClose} withCloseButton={false}>
			<Group>
				<Text>{content}</Text>

				<Button
					ml="auto"
					size="xs"
					variant="light"
					leftSection={<IconCancel size={16} />}
					onClick={onClose}
					disabled={loading}
				>
					Отмена
				</Button>

				<Button
					size="xs"
					color={color}
					onClick={onConfirm}
					leftSection={<IconCheck size={16} />}
					loading={loading}
				>
					{buttonLabel}
				</Button>
			</Group>
		</Modal>
	);
};
