import { ConfirmModal } from '@/components';
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
				if (selectedUser?.id) deleteMutation.mutateAsync(selectedUser.id);
			}}
		/>
	);
};
