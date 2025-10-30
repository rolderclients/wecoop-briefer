import {
  ActionIcon,
  Checkbox,
  Grid,
  Group,
  Paper,
  Space,
  Text,
} from '@mantine/core';
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
      <Grid.Col span="content">
        <Checkbox
          checked={selectedIds.includes(service.id)}
          onChange={(e) => {
            setSelectedIds(
              e.currentTarget.checked
                ? [...selectedIds, service.id]
                : selectedIds.filter((id) => id !== service.id),
            );
          }}
        />
      </Grid.Col>
      <Grid.Col span="auto">
        <Text lh={1}>{service.title}</Text>
      </Grid.Col>
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

  const handleEditClick = () => {
    const values = {
      id: service.id,
      title: service.title,
      category: service.category,
    };
    form.setInitialValues(values);
    form.reset();
    open();
  };

  return (
    <Paper ref={ref} radius="md" withBorder>
      <Grid px="md" py="xs" align="center">
        {children}

        <Grid.Col span="content">
          {archived ? (
            <Space w={28} />
          ) : (
            <ActionIcon
              aria-label="Изменить"
              className={classes.editActionIcon}
              mod={{ hovered }}
              onClick={handleEditClick}
              mt={3.5}
            >
              <IconEdit size={20} />
            </ActionIcon>
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
