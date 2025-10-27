import { Accordion, Group, Space, Stack, Text } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Edit } from './Edit';
import { PromptsList } from './PromptsList';
import { usePrompts } from './PromptsProvider';

export const Services = () => {
  const { servicesWithPrompts, setSelectedIds } = usePrompts();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { id: '', title: '', service: '', model: '' },
    validate: {
      title: isNotEmpty(),
      service: isNotEmpty(),
      model: isNotEmpty(),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Accordion onChange={() => setSelectedIds([])}>
      {servicesWithPrompts.map((serviceWithPrompts) => (
        <Accordion.Item
          key={serviceWithPrompts.id}
          value={serviceWithPrompts.title}
        >
          <Accordion.Control>{serviceWithPrompts.title}</Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Group px="md" c="dimmed" wrap="nowrap">
                <Space w={20} />
                <Text w="100%">Название</Text>
                <Text w={640}>Модель ИИ</Text>
                <Text w={270}>Статус</Text>
              </Group>

              <PromptsList
                prompts={serviceWithPrompts.prompts}
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
