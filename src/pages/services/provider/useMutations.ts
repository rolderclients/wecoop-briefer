import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	createCategoryFn,
	createServiceFn,
	deleteServicesFn,
	updateCategoryFn,
	updateServiceFn,
	updateServicesFn,
} from '@/api';
import type {
	CreateCategory,
	CreateService,
	UpdateCategory,
	UpdateService,
} from '@/app';

export const useMutations = ({ closeCreate }: { closeCreate: () => void }) => {
	const queryClient = useQueryClient();

	const createMutation = useMutation<void, Error, CreateService>({
		mutationFn: (data) => createServiceFn({ data }),
		onSettled: (_, error, vars) => {
			closeCreate(); // Перед загрузкой измененных данных, симпотичнее так.
			if (!error)
				queryClient
					.invalidateQueries({ queryKey: ['categoriesWithServices'] })
					.then(() => {
						notifications.show({
							message: `Услуга "${vars.title}" создана`,
							color: 'green',
						});
					});
		},
	});

	const updateMutation = useMutation<void, Error, UpdateService>({
		mutationFn: (data) => updateServiceFn({ data }),
		onSettled: (_, error, vars) => {
			if (!error)
				queryClient
					.invalidateQueries({ queryKey: ['categoriesWithServices'] })
					.then(() => {
						notifications.show({
							message: `Услуга "${vars.title}" обновлена`,
							color: 'green',
						});
					});
		},
	});

	const updateManyMutation = useMutation<void, Error, UpdateService[]>({
		mutationFn: (data) => updateServicesFn({ data }),
		onSettled: (_, error, vars) => {
			if (!error)
				queryClient
					.invalidateQueries({ queryKey: ['categoriesWithServices'] })
					.then(() => {
						// notifications.show({
						// 	message: `Учетная запись сотрудника "${vars.name}" добавлена`,
						// 	color: 'green',
						// });
					});
		},
	});

	const deleteManyMutation = useMutation<void, Error, string[]>({
		mutationFn: (data) => deleteServicesFn({ data }),
		onSettled: (_, error, vars) => {
			if (!error)
				queryClient.invalidateQueries({ queryKey: ['categoriesWithServices'] });
			// .then(() => {
			// 	notifications.show({
			// 		message: `Услуга "${vars.title}" удалена`,
			// 		color: 'green',
			// 	});
			// });
		},
	});

	const createCategoryMutation = useMutation<void, Error, CreateCategory>({
		mutationFn: (data) => createCategoryFn({ data }),
		onSettled: (_, error, vars) => {
			if (!error)
				queryClient.invalidateQueries({ queryKey: ['categories'] }).then(() => {
					notifications.show({
						message: `Категория "${vars.title}" создана`,
						color: 'green',
					});
				});
		},
	});

	const updateCategoryMutation = useMutation<void, Error, UpdateCategory>({
		mutationFn: (data) => updateCategoryFn({ data }),
		onSettled: (_, error, vars) => {
			if (!error)
				queryClient.invalidateQueries({ queryKey: ['categories'] }).then(() => {
					notifications.show({
						message: `Категория "${vars.title}" обновлена`,
						color: 'green',
					});
				});
		},
	});

	return {
		createMutation,
		updateMutation,
		updateManyMutation,
		deleteManyMutation,
		createCategoryMutation,
		updateCategoryMutation,
	};
};
