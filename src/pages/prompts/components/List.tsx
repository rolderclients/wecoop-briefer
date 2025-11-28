import {
	ActionIcon,
	Box,
	Checkbox,
	Chip,
	Grid,
	Paper,
	Text,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import classes from '@/front/styles.module.css';
import type { Prompt } from '@/types';
import { usePrompts } from '../Provider';

export const PromptsList = ({ prompts }: { prompts: Prompt[] }) => {
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
					enabledPromptId={enabledPromptId}
					setEnabledPromptId={setEnabledPromptId}
				/>
			))}
		</Chip.Group>
	);
};

const PromptPaper = ({
	prompt,
	enabledPromptId,
	setEnabledPromptId,
}: {
	prompt: Prompt;
	enabledPromptId: string | null;
	setEnabledPromptId: (promptId: string | null) => void;
}) => {
	const { hovered, ref } = useHover();
	const {
		prompts,
		selectedIds,
		setSelectedIds,
		isArchived,
		openEdit,
		setSelectedPrompt,
		updateManyMutation,
	} = usePrompts();

	return (
		<Link
			to="/prompts/$promptId"
			params={{ promptId: prompt.id }}
			className={classes.routerLink}
			disabled={prompt.archived}
		>
			<Paper
				ref={ref}
				radius="md"
				withBorder
				className={classes.hoverPaper}
				mod={{ disabled: prompt.archived }}
			>
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
						<Text inline>{prompt.title}</Text>
					</Grid.Col>
					<Grid.Col span="auto">
						<Text inline>{prompt.model.title}</Text>
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

									updateManyMutation.mutate(
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
						{isArchived ? (
							<Box w={28} h={35} />
						) : (
							<ActionIcon
								aria-label="Изменить"
								className={classes.hoverActionIcon}
								mod={{ hovered }}
								onClick={(e) => {
									e.preventDefault();
									setSelectedPrompt(prompt);
									openEdit();
								}}
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
