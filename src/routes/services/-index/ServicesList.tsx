import { ActionIcon, Box, Checkbox, Grid, Paper, Text } from '@mantine/core';
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
  return services.map((service) => (
    <ServicePaper
      key={service.id}
      service={service}
      form={form}
      open={open}
    ></ServicePaper>
  ));
};

const ServicePaper = ({
  service,
  form,
  open,
}: {
  service: Service;
  form: UseFormReturnType<FormService>;
  open: () => void;
}) => {
  const { hovered, ref } = useHover();
  const { selectedIds, setSelectedIds, archived } = useServices();

  const handleEditClick = () => {
    console.log(service);
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

        <Grid.Col span="content">
          {archived ? (
            <Box h={35} />
          ) : (
            <ActionIcon
              aria-label="Изменить"
              className={classes.editActionIcon}
              mod={{ hovered }}
              onClick={handleEditClick}
              mt={4}
            >
              <IconEdit size={20} />
            </ActionIcon>
          )}
        </Grid.Col>
      </Grid>
    </Paper>
  );
};
