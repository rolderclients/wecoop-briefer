import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
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
  modelsQueryOptions,
  servicesPromptsQueryOptions,
  servicesQueryOptions,
  updatePrompt,
} from '@/api/repositories';
import { Route } from './route';

interface PromptsContext {
  services: Service[];
  models: Model[];
  servicesWithPrompts: ServiceWithPrompts[];
  prompts: Prompt[];
  createPrompt: (promptData: NewPrompt) => void;
  updatePrompt: (promptData: UpdatePrompt) => void;
  // updateServices: (servicesData: UpdateService[]) => void;
  // deleteServices: (ids: string[]) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  archived?: boolean;
  setArchived: (archived: boolean) => void;
}

const PromptsContext = createContext<PromptsContext | null>(null);

export const PromptsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { archived: initialArchived } = Route.useSearch();
  const [archived, setArchived] = useState(initialArchived);
  const { data: services } = useSuspenseQuery(servicesQueryOptions());
  const { data: models } = useSuspenseQuery(modelsQueryOptions());
  const { data: servicesWithPrompts } = useSuspenseQuery(
    servicesPromptsQueryOptions(initialArchived),
  );

  const createPromptMutation = useMutation({
    mutationFn: (promptData: NewPrompt) =>
      createPrompt({ data: { promptData } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }),
  });

  const updatePromptMutation = useMutation({
    mutationFn: (promptData: UpdatePrompt) =>
      updatePrompt({ data: { promptData } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['prompts'] }),
  });

  // const updateServicesMutation = useMutation({
  //   mutationFn: (servicesData: UpdateService[]) =>
  //     updateServices({ data: { servicesData } }),
  //   onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  // });

  // const deleteServicesMutation = useMutation({
  //   mutationFn: (ids: string[]) => deleteServices({ data: { ids } }),
  //   onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  // });

  const value = {
    services,
    models,
    servicesWithPrompts,
    prompts: servicesWithPrompts.flatMap((service) => service.prompts),
    createPrompt: createPromptMutation.mutate,
    updatePrompt: updatePromptMutation.mutate,
    // updateServices: updateServicesMutation.mutate,
    // deleteServices: deleteServicesMutation.mutate,
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
