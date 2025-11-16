import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
	type Category,
	type CategoryWithServices,
	categoriesQueryOptions,
	categoriesWithServicesQueryOptions,
	createService,
	deleteServices,
	type NewService,
	type Service,
	type UpdateService,
	updateService,
	updateServices,
} from '@/api';

interface ServicesContext {
	categories: Category[];
	categoriesWithServices: CategoryWithServices[];
	services: Service[];
	createService: (serviceData: NewService) => void;
	updateService: (serviceData: UpdateService) => void;
	updateServices: (servicesData: UpdateService[]) => void;
	deleteServices: (ids: string[]) => void;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	archived?: boolean;
	setArchived: (archived: boolean) => void;
}

const ServicesContext = createContext<ServicesContext | null>(null);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { archived: initialArchived } = useSearch({ from: '/services' });
	const [archived, setArchived] = useState(initialArchived);
	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: categoriesWithServices } = useSuspenseQuery(
		categoriesWithServicesQueryOptions(initialArchived),
	);

	const queryClient = useQueryClient();
	const createServiceMutation = useMutation({
		mutationFn: (serviceData: NewService) =>
			createService({ data: { serviceData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['categoriesWithServices'] }),
	});

	const updateServiceMutation = useMutation({
		mutationFn: (serviceData: UpdateService) =>
			updateService({ data: { serviceData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['categoriesWithServices'] }),
	});

	const updateServicesMutation = useMutation({
		mutationFn: (servicesData: UpdateService[]) =>
			updateServices({ data: { servicesData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['categoriesWithServices'] }),
	});

	const deleteServicesMutation = useMutation({
		mutationFn: (ids: string[]) => deleteServices({ data: { ids } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['categoriesWithServices'] }),
	});

	const value = {
		categories,
		categoriesWithServices,
		services: categoriesWithServices.flatMap((i) => i.services),
		createService: createServiceMutation.mutate,
		updateService: updateServiceMutation.mutate,
		updateServices: updateServicesMutation.mutate,
		deleteServices: deleteServicesMutation.mutate,
		selectedIds,
		setSelectedIds,
		archived,
		setArchived,
	};

	return (
		<ServicesContext.Provider value={value}>
			{children}
		</ServicesContext.Provider>
	);
};

export const useServices = () => {
	const context = useContext(ServicesContext);
	if (!context) {
		throw new Error('useServices must be used within ServicesProvider');
	}
	return context;
};
