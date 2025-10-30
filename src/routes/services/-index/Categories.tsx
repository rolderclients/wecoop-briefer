import { Accordion, Grid, Space, Stack, Text } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Edit } from './Edit';
import { ServicesList } from './ServicesList';
import { useServices } from './ServicesProvider';

export const Categories = () => {
  const { categoriesWithServices, setSelectedIds } = useServices();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { id: '', title: '', category: '' },
    validate: { title: isNotEmpty(), category: isNotEmpty() },
  });

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Accordion onChange={() => setSelectedIds([])}>
      {categoriesWithServices.map((categoryWithServices) => (
        <Accordion.Item
          key={categoryWithServices.id}
          value={categoryWithServices.title}
        >
          <Accordion.Control>
            {categoryWithServices.title}{' '}
            <Text c="dimmed" span>
              {categoryWithServices.services.length}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Grid px="md" c="dimmed">
                <Grid.Col span="content">
                  <Space w={20} />
                </Grid.Col>
                <Grid.Col span="auto">Название</Grid.Col>
                <Grid.Col span="content">
                  <Space w={28} />
                </Grid.Col>
              </Grid>

              <ServicesList
                services={categoryWithServices.services}
                form={form}
                open={open}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}

      <Edit form={form} opened={opened} close={close} />
    </Accordion>
  );
};
