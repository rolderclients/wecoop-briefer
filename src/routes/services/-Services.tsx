import { Box, Button, Group, Paper, Stack, Switch, Text } from '@mantine/core';
import { IconArchive, IconPlus, IconTrash } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Page } from '@/components';
import { ServiceList } from './-ServiceList';
import { useServices } from './-useServices';
import { Route } from './route';

export const Services = () => {
  const navigate = useNavigate({ from: Route.fullPath });

  const { archived: searchArchived } = Route.useSearch();
  const [archived, setArchived] = useState(searchArchived);

  const { services, createService, updateServices, deleteServices } =
    useServices(searchArchived);

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
                    deleteServices(selectedIds);
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
                    updateServices(
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
                createService({
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
        <ServiceList
          services={services}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </Stack>
    </Page>
  );
};
