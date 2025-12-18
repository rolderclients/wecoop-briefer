import { Accordion, Grid, Space, Stack, Text } from '@mantine/core';
import { usePrompts } from '../Provider';
import { PromptsList } from './List';

export const Accordions = () => {
	const { servicesWithPrompts, setSelectedIds } = usePrompts();

	return (
		<Accordion onChange={() => setSelectedIds([])}>
			{servicesWithPrompts.map((serviceWithPrompts) => (
				<Accordion.Item
					key={serviceWithPrompts.id}
					value={serviceWithPrompts.title}
				>
					<Accordion.Control>
						{serviceWithPrompts.title}{' '}
						<Text c="dimmed" span>
							{serviceWithPrompts.prompts.length}
						</Text>
					</Accordion.Control>
					<Accordion.Panel>
						<Stack>
							<Grid px="md" c="dimmed">
								<Grid.Col span="content">
									<Space w={20} />
								</Grid.Col>
								<Grid.Col span="auto">Название</Grid.Col>
								<Grid.Col span="auto">Модель ИИ</Grid.Col>
								<Grid.Col span="content">
									<Text w={110}>Статус</Text>
								</Grid.Col>
								<Grid.Col span="content">
									<Space w={28} />
								</Grid.Col>
							</Grid>

							<PromptsList prompts={serviceWithPrompts.prompts} />
						</Stack>
					</Accordion.Panel>
				</Accordion.Item>
			))}
		</Accordion>
	);
};
