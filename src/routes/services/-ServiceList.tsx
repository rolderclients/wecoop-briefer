import { ActionIcon, Checkbox, Group, Paper, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import type { Service } from '@/api';

import { useServices } from './-ServicesProvider';

export const ServiceList = () => {
  const { services, selectedIds, setSelectedIds } = useServices();

  return services.map((service) => (
    <ServicePaper key={service.id} service={service}>
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
    </ServicePaper>
  ));
};

const ServicePaper = ({
  children,
  service,
}: {
  children: React.ReactNode;
  service: Service;
}) => {
  const { hovered, ref } = useHover();
  const { open, setFormType, form, archived } = useServices();

  return (
    <Paper ref={ref} radius="md" withBorder py="sm" pos="relative">
      {children}

      {!archived && (
        <ActionIcon
          aria-label="Изменить"
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
          onClick={() => {
            setFormType('edit');
            form.setValues({
              id: service.id,
              title: service.title,
              category: service.category,
            });
            open();
          }}
        >
          <IconEdit />
        </ActionIcon>
      )}
    </Paper>
  );
};
