import {
  ActionIcon,
  Box,
  Checkbox,
  Chip,
  Grid,
  Paper,
  Text,
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
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
        <PromptPaper
          key={prompt.id}
          prompt={prompt}
          form={form}
          open={open}
          enabledPromptId={enabledPromptId}
          setEnabledPromptId={setEnabledPromptId}
        />
      ))}
    </Chip.Group>
  );
};

const PromptPaper = ({
  prompt,
  form,
  open,
  enabledPromptId,
  setEnabledPromptId,
}: {
  prompt: Prompt;
  form: UseFormReturnType<FormPrompt>;
  open: () => void;
  enabledPromptId: string | null;
  setEnabledPromptId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { hovered, ref } = useHover();
  const { prompts, selectedIds, setSelectedIds, archived, updatePrompts } =
    usePrompts();

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

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
    <Link
      to="/prompts/$promptId"
      params={{ promptId: prompt.id }}
      preload="intent"
      reloadDocument={true}
      className={classes.routerLink}
    >
      <Paper ref={ref} radius="md" withBorder className={classes.hoverPaper}>
        <Grid px="md" py="xs" align="center">
          <Grid.Col span="content">
            <Checkbox
              checked={selectedIds.includes(prompt.id)}
              onClick={(e) => e.stopPropagation()}
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
            <Box w={110} onClick={(e) => e.stopPropagation()}>
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

          <Grid.Col span="content">
            {archived ? (
              <Box w={28} h={35} />
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
    </Link>
  );
};
