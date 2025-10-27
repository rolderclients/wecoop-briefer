import { ActionIcon, Checkbox, Group, Paper, Text } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import type { FormService, Service } from '@/api';
import classes from '../../styles.module.css';
import { useServices } from './ServicesProvider';

export const ServicesList = ({
  services,
  form,
  open,
}: {
  services: Service[];
  form: UseFormReturnType<FormService>;
  open: () => void;
}) => {
  const { selectedIds, setSelectedIds } = useServices();

  return services.map((service) => (
    <ServicePaper key={service.id} service={service} form={form} open={open}>
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
        <Text>{service.title}</Text>
      </Group>
    </ServicePaper>
  ));
};

const ServicePaper = ({
  children,
  service,
  form,
  open,
}: {
  children: React.ReactNode;
  service: Service;
  form: UseFormReturnType<FormService>;
  open: () => void;
}) => {
  const { hovered, ref } = useHover();
  const { archived } = useServices();

  return (
    <Paper ref={ref} radius="md" withBorder py="sm" pos="relative">
      {children}

      {!archived && (
        <ActionIcon
          aria-label="Изменить"
          className={classes.editActionIcon}
          mod={{ hovered }}
          onClick={() => {
            const values = {
              id: service.id,
              title: service.title,
              category: service.category,
            };
            form.setInitialValues(values);
            form.reset();
            open();
          }}
        >
          <IconEdit />
        </ActionIcon>
      )}
    </Paper>
  );
};
