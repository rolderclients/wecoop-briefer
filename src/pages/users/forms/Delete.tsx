import { notifications } from '@mantine/notifications';
import { ConfirmModal } from '@/front';
import { useUsers } from '../provider';

export const Delete = () => {
	const { selectedUser, deleteOpened, closeDelete, deleteMutation } =
		useUsers();

	return (
		<ConfirmModal
			buttonLabel="Удалить"
			color="red"
			opened={deleteOpened}
			onClose={closeDelete}
			loading={deleteMutation.isPending}
			onConfirm={async () => {
				if (selectedUser?.id) {
					await deleteMutation.mutateAsync(selectedUser.id);
					closeDelete();
					notifications.show({
						message: `Учетная запись сотрудника "${selectedUser?.name}" удалена`,
						color: 'orange',
					});
				}
			}}
		/>
	);
};
