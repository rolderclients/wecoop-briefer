import {
  ActionIcon,
  Box,
  Checkbox,
  Chip,
  Grid,
  Paper,
  Space,
  Text,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
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
          <Grid.Col span="content">
            <Checkbox
              checked={selectedIds.includes(prompt.id)}
              onChange={(e) => {
                setSelectedIds(
                  e.currentTarget.checked
                    ? [...selectedIds, prompt.id]
                    : selectedIds.filter((id) => id !== prompt.id),
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <Text lh={1}>{prompt.title}</Text>
          </Grid.Col>
          <Grid.Col span="auto">
            <Text lh={1}>{prompt.model.title}</Text>
          </Grid.Col>
          <Grid.Col span="content">
            <Box w={110}>
              <Chip
                value={prompt.id}
                disabled={prompt.archived}
                mod={{ chip: true }}
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
          </Grid.Col>
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
  const navigate = useNavigate();

  const handlePaperClick = (e: React.MouseEvent) => {
    // Не переходить если кликнули по чекбоксу или чипу
    const target = e.target as HTMLElement;
    if (
      target.closest('input[type="checkbox"]') ||
      target.closest('[data-chip]') ||
      target.closest('button')
    ) {
      return;
    }

    navigate({
      to: '/prompts/$promptId',
      params: { promptId: prompt.id },
      reloadDocument: true,
    });
  };

  const handleEditClick = () => {
    const values = {
      id: prompt.id,
      title: prompt.title,
      service: prompt.service,
      model: prompt.model.id,
    };
    form.setInitialValues(values);
    form.reset();
    open();
  };

  return (
    <Paper
      ref={ref}
      radius="md"
      withBorder
      className={classes.promptPaper}
      onClick={handlePaperClick}
    >
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
