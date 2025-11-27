import { useDisclosure } from '@mantine/hooks';
import {
	type UseMutationResult,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
	categoriesQueryOptions,
	categoriesWithServicesQueryOptions,
	createCategoryFn,
	createServiceFn,
	deleteServicesFn,
	updateCategoryFn,
	updateServiceFn,
	updateServicesFn,
} from '@/api';
import type {
	Category,
	CategoryWithServices,
	CreateCategory,
	CreateService,
	Service,
	UpdateCategory,
	UpdateService,
} from '@/app';
import { useMutaitionWithInvalidate } from '@/components';
import { Route } from '@/routes/_authed/services';

interface ServicesContext {
	categories: Category[];
	categoriesWithServices: CategoryWithServices[];
	services: Service[];
	createMutation: UseMutationResult<void, Error, CreateService, unknown>;
	updateMutation: UseMutationResult<void, Error, UpdateService, unknown>;
	updateManyMutation: UseMutationResult<void, Error, UpdateService[], unknown>;
	deleteManyMutation: UseMutationResult<void, Error, string[], unknown>;
	createCategoryMutation: UseMutationResult<
		void,
		Error,
		CreateCategory,
		unknown
	>;
	updateCategoryMutation: UseMutationResult<
		void,
		Error,
		UpdateCategory,
		unknown
	>;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	selectedService: Service | null;
	setSelectedService: (service: Service | null) => void;
	isArchived?: boolean;
	setIsArchived: (archived: boolean) => void;
	isCreateOpened: boolean;
	openCreate: () => void;
	closeCreate: () => void;
	isEditingCategory: boolean;
	setIsEditingCategory: (editing: boolean) => void;
	isEditingOpened: boolean;
	openEdit: () => void;
	closeEdit: () => void;
}

const ServicesContext = createContext<ServicesContext | null>(null);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
	const { archived: initialArchived } = useSearch({ from: Route.id });
	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: categoriesWithServices } = useSuspenseQuery(
		categoriesWithServicesQueryOptions(initialArchived),
	);

	const createMutation = useMutaitionWithInvalidate<CreateService>(
		createServiceFn,
		['categoriesWithServices'],
	);
	const updateMutation = useMutaitionWithInvalidate<UpdateService>(
		updateServiceFn,
		['categoriesWithServices'],
	);
	const updateManyMutation = useMutaitionWithInvalidate<UpdateService[]>(
		updateServicesFn,
		['categoriesWithServices'],
	);
	const deleteManyMutation = useMutaitionWithInvalidate<string[]>(
		deleteServicesFn,
		['categoriesWithServices'],
	);
	const createCategoryMutation = useMutaitionWithInvalidate<CreateCategory>(
		createCategoryFn,
		['categories'],
	);
	const updateCategoryMutation = useMutaitionWithInvalidate<UpdateCategory>(
		updateCategoryFn,
		['categories'],
	);

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [selectedService, setSelectedService] = useState<Service | null>(null);
	const [isArchived, setIsArchived] = useState(initialArchived);
	const [isEditingCategory, setIsEditingCategory] = useState(false);

	const [isCreateOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [isEditingOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);

	const value = {
		categories,
		categoriesWithServices,
		services: categoriesWithServices.flatMap((i) => i.services),
		createMutation,
		updateMutation,
		updateManyMutation,
		deleteManyMutation,
		createCategoryMutation,
		updateCategoryMutation,
		selectedIds,
		setSelectedIds,
		selectedService,
		setSelectedService,
		isArchived,
		setIsArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
		isEditingCategory,
		setIsEditingCategory,
		isEditingOpened,
		openEdit,
		closeEdit,
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
