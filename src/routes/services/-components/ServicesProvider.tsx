import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import {
  type Category,
  categoriesQueryOptions,
  createService,
  deleteServices,
  type NewService,
  type Service,
  servicesQueryOptions,
  type UpdateService,
  updateService,
  updateServices,
} from '@/api';
import { Route } from '../route';

interface ServicesContext {
  categories: Category[];
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
  const queryClient = useQueryClient();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { archived: initialArchived } = Route.useSearch();
  const [archived, setArchived] = useState(initialArchived);
  const { data: categories } = useSuspenseQuery(categoriesQueryOptions());
  const { data: services } = useSuspenseQuery(
    servicesQueryOptions(initialArchived),
  );

  const createServiceMutation = useMutation({
    mutationFn: (serviceData: NewService) =>
      createService({ data: { serviceData } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const updateServiceMutation = useMutation({
    mutationFn: (serviceData: UpdateService) =>
      updateService({ data: { serviceData } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const updateServicesMutation = useMutation({
    mutationFn: (servicesData: UpdateService[]) =>
      updateServices({ data: { servicesData } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const deleteServicesMutation = useMutation({
    mutationFn: (ids: string[]) => deleteServices({ data: { ids } }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });

  const value = {
    categories,
    services,
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
