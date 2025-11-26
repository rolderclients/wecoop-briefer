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
import { Route } from '@/routes/_authed/services';
import { useMutations } from './useMutations';

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
	isArchived?: boolean;
	setIsArchived: (archived: boolean) => void;
	isCreateOpened: boolean;
	openCreate: () => void;
	closeCreate: () => void;
	isEditingCategory: boolean;
	setIsEditingCategory: (editing: boolean) => void;
}

const ServicesContext = createContext<ServicesContext | null>(null);

export const ServicesProvider = ({ children }: { children: ReactNode }) => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { archived: initialArchived } = useSearch({ from: Route.id });
	const [isArchived, setIsArchived] = useState(initialArchived);
	const [isEditingCategory, setIsEditingCategory] = useState(false);
	const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
	const { data: categoriesWithServices } = useSuspenseQuery(
		categoriesWithServicesQueryOptions(initialArchived),
	);

	const [isCreateOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);

	const {
		createMutation,
		updateMutation,
		updateManyMutation,
		deleteManyMutation,
		createCategoryMutation,
		updateCategoryMutation,
	} = useMutations({ closeCreate });

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
		isArchived,
		setIsArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
		isEditingCategory,
		setIsEditingCategory,
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
