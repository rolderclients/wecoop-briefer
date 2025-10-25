import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  createService,
  deleteServices,
  type NewService,
  servicesQueryOptions,
  type UpdateService,
  updateServices,
} from '@/api';

export const useServices = (archived?: boolean) => {
  const queryClient = useQueryClient();

  const { data: services } = useSuspenseQuery(servicesQueryOptions(archived));

  const createServiceMutation = useMutation({
    mutationFn: (serviceData: NewService) =>
      createService({ data: { serviceData } }),
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

  return {
    services,
    createService: createServiceMutation.mutate,
    updateServices: updateServicesMutation.mutate,
    deleteServices: deleteServicesMutation.mutate,
  };
};
