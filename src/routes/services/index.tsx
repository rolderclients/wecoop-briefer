import {
  Box,
  Button,
  Checkbox,
  Group,
  Paper,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { IconArchive, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  createService,
  deleteServices,
  type NewService,
  type Service,
  servicesQueryOptions,
  type UpdateService,
  updateServices,
} from '@/api';
import { Page } from '@/components';

export const Route = createFileRoute('/services/')({
  loaderDeps: ({ search: { archived } }) => ({ archived }),
  loader: async ({ context, deps: { archived } }) => {
    await context.queryClient.ensureQueryData(servicesQueryOptions(archived));
  },
  component: Home,
  validateSearch: (search: Record<string, unknown>): { archived?: boolean } => {
    return {
      archived: search?.archived === true ? true : undefined,
    };
  },
});

function Home() {
  const { archived: searchArchived } = Route.useSearch();
  const [archived, setArchived] = useState(searchArchived);

  const navigate = useNavigate({ from: Route.fullPath });

  const queryClient = useQueryClient();
  const { data: services } = useSuspenseQuery(
    servicesQueryOptions(searchArchived),
  );

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

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <Page>
      <Stack>
        <Paper radius="md" withBorder py="sm" px="md">
          <Group wrap="nowrap" justify="space-between">
            <Group wrap="nowrap">
              <Switch
                label="Архив"
                checked={archived}
                onChange={(e) => {
                  setArchived(e.currentTarget.checked);
                  navigate({
                    search: () => ({ archived: e.currentTarget.checked }),
                  });
                  setSelectedIds([]);
                }}
              />

              {archived ? (
                <Button
                  size="xs"
                  color="red"
                  variant="light"
                  leftSection={<IconTrash size={16} />}
                  disabled={!selectedIds.length}
                  rightSection={
                    selectedIds.length > 0 ? selectedIds.length : null
                  }
                  onClick={() => {
                    deleteServicesMutation.mutate(selectedIds);
                    setSelectedIds([]);
                  }}
                >
                  Удалить
                </Button>
              ) : (
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconArchive size={16} />}
                  disabled={!selectedIds.length}
                  rightSection={
                    selectedIds.length > 0 ? selectedIds.length : null
                  }
                  onClick={() => {
                    updateServicesMutation.mutate(
                      services
                        .filter((i) => selectedIds.includes(i.id))
                        .map((i) => ({ id: i.id, archived: true })),
                    );
                    setSelectedIds([]);
                  }}
                >
                  Архивировать
                </Button>
              )}
            </Group>

            <Button
              leftSection={<IconPlus size={20} />}
              disabled={archived}
              onClick={() => {
                createServiceMutation.mutate({
                  title: 'TEST 3',
                  category: 'category:78uync7chhjv3ev7a1xu',
                });
              }}
            >
              Добавить
            </Button>
          </Group>
        </Paper>

        <Group px="md" c="dimmed" wrap="nowrap">
          <Box w={20} />
          <Text w="47%">Название</Text>
          <Text w="47%">Категория</Text>
        </Group>
        <Services
          // services={archived && archiveServices ? archiveServices : services}
          services={services}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </Stack>
    </Page>
  );
}

const Services = ({
  services,
  selectedIds,
  setSelectedIds,
}: {
  services: Service[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}) => {
  return services.map((service) => (
    <Paper radius="md" withBorder py="sm" key={service.id}>
      <Group px="md" wrap="nowrap">
        <Checkbox
          checked={selectedIds.includes(service.id)}
          onChange={(e) =>
            setSelectedIds(
              e.currentTarget.checked
                ? [...selectedIds, service.id]
                : selectedIds.filter((id) => id !== service.id),
            )
          }
        />
        <Text w="47%">{service.title}</Text>
        <Text w="47%">{service.categoryTitle}</Text>
      </Group>
    </Paper>
  ));
};
