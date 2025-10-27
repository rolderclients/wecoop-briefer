import {
  ActionIcon,
  Box,
  Checkbox,
  Chip,
  Group,
  Paper,
  Text,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import type { FormPrompt, Prompt } from '@/api';
import classes from '../../styles.module.css';
import { usePrompts } from './PromptsProvider';

export const PromptsList = ({
  prompts,
  form,
  open,
}: {
  prompts: Prompt[];
  form: UseFormReturnType<FormPrompt>;
  open: () => void;
}) => {
  const { selectedIds, setSelectedIds, updatePrompts } = usePrompts();
  const [enabledPromptId, setEnabledPromptId] = useState<string | null>(null);

  useEffect(() => {
    setEnabledPromptId(
      prompts.some((p) => p.enabled)
        ? prompts.find((p) => p.enabled)?.id || null
        : null,
    );
  }, [prompts]);

  return (
    <Chip.Group
      multiple={false}
      value={enabledPromptId}
      onChange={setEnabledPromptId}
    >
      {prompts.map((prompt) => (
        <PromptPaper key={prompt.id} prompt={prompt} form={form} open={open}>
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
              <Chip
                value={prompt.id}
                disabled={prompt.archived}
                onClick={() => {
                  const deselected = prompt.id === enabledPromptId;
                  if (deselected) setEnabledPromptId(null);

                  updatePrompts(
                    prompts.map((i) => ({
                      id: i.id,
                      enabled: !deselected && i.id === prompt.id,
                    })),
                  );
                }}
              >
                {enabledPromptId === prompt.id ? 'Включен' : 'Выключен'}
              </Chip>
            </Box>
          </Group>
        </PromptPaper>
      ))}
    </Chip.Group>
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
          className={classes.editActionIcon}
          mod={{ hovered }}
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
