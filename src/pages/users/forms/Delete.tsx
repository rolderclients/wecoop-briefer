import { ConfirmModal } from '@/components';
import { useUsers } from '../Provider';

export const Delete = () => {
	const { selectedUser, deleteOpened, closeDelete, deleteMutation } =
		useUsers();

	return (
		<ConfirmModal
			label="Удалить"
			color="red"
			opened={deleteOpened}
			onClose={closeDelete}
			loading={deleteMutation.isPending}
			onConfirm={async () => {
				if (selectedUser?.id)
					deleteMutation.mutateAsync({ id: selectedUser.id });
			}}
		/>
	);
};
