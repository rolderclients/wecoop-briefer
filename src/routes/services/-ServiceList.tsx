import { Checkbox, Group, Paper, Text } from '@mantine/core';
import type { Service } from '@/api';

export const ServiceList = ({
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
