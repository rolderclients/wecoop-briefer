import { Accordion, Grid, Space, Stack, Text } from '@mantine/core';
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
