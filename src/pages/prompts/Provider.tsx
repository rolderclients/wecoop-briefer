import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext, useState } from 'react';
import type {
	Model,
	NewPrompt,
	Prompt,
	Service,
	ServiceWithPrompts,
	UpdatePrompt,
} from '@/api';
import {
	createPrompt,
	deletePrompts,
	modelsQueryOptions,
	servicesQueryOptions,
	servicesWithPromptsQueryOptions,
	updatePrompt,
	updatePrompts,
} from '@/api';
import { Route } from '@/routes/_authed/prompts';

interface PromptsContext {
	services: Service[];
	models: Model[];
	servicesWithPrompts: ServiceWithPrompts[];
	prompts: Prompt[];
	createPrompt: (promptData: NewPrompt) => void;
	updatePrompt: (promptData: UpdatePrompt) => void;
	updatePrompts: (promptData: UpdatePrompt[]) => void;
	deletePrompts: (ids: string[]) => void;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	archived?: boolean;
	setArchived: (archived: boolean) => void;
}

const PromptsContext = createContext<PromptsContext | null>(null);

export const PromptsProvider = ({ children }: { children: ReactNode }) => {
	const queryClient = useQueryClient();

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const { archived: initialArchived } = useSearch({ from: Route.id });
	const [archived, setArchived] = useState(initialArchived);
	const { data: services } = useSuspenseQuery(servicesQueryOptions());
	const { data: models } = useSuspenseQuery(modelsQueryOptions());
	const { data: servicesWithPrompts } = useSuspenseQuery(
		servicesWithPromptsQueryOptions(initialArchived),
	);

	const createPromptMutation = useMutation({
		mutationFn: (promptData: NewPrompt) =>
			createPrompt({ data: { promptData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['servicesWithPrompts'] }),
	});

	const updatePromptMutation = useMutation({
		mutationFn: (promptData: UpdatePrompt) =>
			updatePrompt({ data: { promptData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['servicesWithPrompts'] }),
	});

	const updatePromptsMutation = useMutation({
		mutationFn: (promptsData: UpdatePrompt[]) =>
			updatePrompts({ data: { promptsData } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['servicesWithPrompts'] }),
	});

	const deletePromptsMutation = useMutation({
		mutationFn: (ids: string[]) => deletePrompts({ data: { ids } }),
		onSettled: () =>
			queryClient.invalidateQueries({ queryKey: ['servicesWithPrompts'] }),
	});

	const value = {
		services,
		models,
		servicesWithPrompts,
		prompts: servicesWithPrompts.flatMap((i) => i.prompts),
		createPrompt: createPromptMutation.mutate,
		updatePrompt: updatePromptMutation.mutate,
		updatePrompts: updatePromptsMutation.mutate,
		deletePrompts: deletePromptsMutation.mutate,
		selectedIds,
		setSelectedIds,
		archived,
		setArchived,
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
