import { useDisclosure } from '@mantine/hooks';
import {
	type UseMutationResult,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	createPromptFn,
	deletePromptsFn,
	modelsQueryOptions,
	servicesQueryOptions,
	servicesWithPromptsQueryOptions,
	updatePromptFn,
	updatePromptsFn,
} from '@/back';
import { useMutaitionWithInvalidate } from '@/front';
import { Route } from '@/routes/_authed/prompts';
import type {
	CreatePrompt,
	Model,
	Prompt,
	Service,
	ServiceWithPrompts,
	UpdatePrompt,
} from '@/types';

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
	isArchived: boolean;
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
	const navigate = useNavigate({ from: Route.fullPath });
	const isArchived = useSearch({
		from: Route.id,
		select: (data) => !!data.archived,
	});

	const { data: services } = useSuspenseQuery(servicesQueryOptions(isArchived));
	const { data: models } = useSuspenseQuery(modelsQueryOptions());
	const { data: servicesWithPrompts } = useSuspenseQuery(
		servicesWithPromptsQueryOptions(isArchived),
	);

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <>
	useEffect(() => {
		setSelectedIds([]);
		setSelectedPrompt(null);
	}, [isArchived]);

	const [isCreateOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [isEditingOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);

	const createMutation = useMutaitionWithInvalidate<CreatePrompt>(
		createPromptFn,
		['servicesWithPrompts'],
	);
	const updateMutation = useMutaitionWithInvalidate<UpdatePrompt>(
		updatePromptFn,
		['servicesWithPrompts'],
	);
	const updateManyMutation = useMutaitionWithInvalidate<UpdatePrompt[]>(
		updatePromptsFn,
		['servicesWithPrompts'],
	);
	const deleteManyMutation = useMutaitionWithInvalidate<string[]>(
		deletePromptsFn,
		['servicesWithPrompts'],
	);

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
		setIsArchived: (archived: boolean) =>
			navigate({ search: () => ({ archived }) }),
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
