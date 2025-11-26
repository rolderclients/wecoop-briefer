import { useDisclosure } from '@mantine/hooks';
import {
	type UseMutationResult,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
	createPromptFn,
	deletePromptsFn,
	modelsQueryOptions,
	servicesQueryOptions,
	servicesWithPromptsQueryOptions,
	updatePromptFn,
	updatePromptsFn,
} from '@/api';
import type {
	CreatePrompt,
	Model,
	Prompt,
	Service,
	ServiceWithPrompts,
	UpdatePrompt,
} from '@/app';
import { useQueryWithInvalidate } from '@/components';
import { Route } from '@/routes/_authed/prompts';

interface PromptsContext {
	services: Service[];
	models: Model[];
	servicesWithPrompts: ServiceWithPrompts[];
	prompts: Prompt[];
	createMutation: UseMutationResult<void, Error, CreatePrompt, unknown>;
	updateMutation: UseMutationResult<void, Error, UpdatePrompt, unknown>;
	updateManyMutation: UseMutationResult<void, Error, UpdatePrompt[], unknown>;
	deleteManyMutation: UseMutationResult<void, Error, string[], unknown>;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	isArchived?: boolean;
	setIsArchived: (archived: boolean) => void;
	selectedPrompt: Prompt | null;
	setSelectedPrompt: (prompt: Prompt | null) => void;
	isCreateOpened: boolean;
	openCreate: () => void;
	closeCreate: () => void;
	isEditingOpened: boolean;
	openEdit: () => void;
	closeEdit: () => void;
}

const PromptsContext = createContext<PromptsContext | null>(null);

export const PromptsProvider = ({ children }: { children: ReactNode }) => {
	const { archived: initialArchived } = useSearch({ from: Route.id });
	const { data: services } = useSuspenseQuery(servicesQueryOptions());
	const { data: models } = useSuspenseQuery(modelsQueryOptions());
	const { data: servicesWithPrompts } = useSuspenseQuery(
		servicesWithPromptsQueryOptions(initialArchived),
	);

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
	const [isArchived, setIsArchived] = useState(initialArchived);

	const [isCreateOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [isEditingOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);

	const createMutation = useQueryWithInvalidate<CreatePrompt>(createPromptFn, [
		'servicesWithPrompts',
	]);
	const updateMutation = useQueryWithInvalidate<UpdatePrompt>(updatePromptFn, [
		'servicesWithPrompts',
	]);
	const updateManyMutation = useQueryWithInvalidate<UpdatePrompt[]>(
		updatePromptsFn,
		['servicesWithPrompts'],
	);
	const deleteManyMutation = useQueryWithInvalidate<string[]>(deletePromptsFn, [
		'servicesWithPrompts',
	]);

	const value = {
		services,
		models,
		servicesWithPrompts,
		prompts: servicesWithPrompts.flatMap((i) => i.prompts),
		createMutation,
		updateMutation,
		updateManyMutation,
		deleteManyMutation,
		selectedIds,
		setSelectedIds,
		selectedPrompt,
		setSelectedPrompt,
		isArchived,
		setIsArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
		isEditingOpened,
		openEdit,
		closeEdit,
	};

	return (
		<PromptsContext.Provider value={value}>{children}</PromptsContext.Provider>
	);
};

export const usePrompts = () => {
	const context = useContext(PromptsContext);
	if (!context) {
		throw new Error('usePrompts must be used within PromptsProvider');
	}
	return context;
};
