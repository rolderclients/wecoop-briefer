import {
  Accordion,
  ActionIcon,
  Box,
  Checkbox,
  Chip,
  Group,
  Paper,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { isNotEmpty, type UseFormReturnType, useForm } from '@mantine/form';
import { useDisclosure, useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { useState } from 'react';
import type { FormPrompt, Prompt } from '@/api';
import { Edit } from './-Edit';
import { usePrompts } from './-PromptsProvider';

export const PromptsList = () => {
  const { servicesWithPrompts, selectedIds, setSelectedIds } = usePrompts();

  const [enabledPromptId, setEnabledPromptId] = useState<string | null>(null);
  const handleChipClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (event.currentTarget.value === enabledPromptId) {
      setEnabledPromptId(null);
    }
  };

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

  const items = servicesWithPrompts.map((serviceWithPrompts) => (
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

          <Chip.Group
            multiple={false}
            value={enabledPromptId}
            onChange={setEnabledPromptId}
          >
            {serviceWithPrompts.prompts.map((prompt) => (
              <PromptPaper
                key={prompt.id}
                prompt={prompt}
                form={form}
                open={open}
              >
                <Group px="md" wrap="nowrap">
                  <Checkbox
                    checked={selectedIds.includes(prompt.id)}
                    onChange={(e) =>
                      setSelectedIds(
                        e.currentTarget.checked
                          ? [...selectedIds, prompt.id]
                          : selectedIds.filter((id) => id !== prompt.id),
                      )
                    }
                  />
                  <Text w="100%">{prompt.title}</Text>
                  <Text w={640}>{prompt.model.title}</Text>
                  <Box w={270}>
                    <Chip value={prompt.id} onClick={handleChipClick}>
                      {enabledPromptId === prompt.id ? 'Включен' : 'Отключен'}
                    </Chip>
                  </Box>
                </Group>
              </PromptPaper>
            ))}
          </Chip.Group>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <>
      <Accordion onChange={() => setSelectedIds([])}>{items}</Accordion>
      <Edit form={form} opened={opened} close={close} />
    </>
  );
};

const PromptPaper = ({
  children,
  prompt,
  form,
  open,
}: {
  children: React.ReactNode;
  prompt: Prompt;
  form: UseFormReturnType<FormPrompt>;
  open: () => void;
}) => {
  const { hovered, ref } = useHover();
  const { archived } = usePrompts();

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
            const values = {
              id: prompt.id,
              title: prompt.title,
              service: prompt.service,
              model: prompt.model.id,
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
