import { Accordion, Grid, Space, Stack, Text } from '@mantine/core';
import { useServices } from '../Provider';
import { ServicesList } from './List';

export const Accordions = () => {
	const { categoriesWithServices, setSelectedIds } = useServices();

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

							<ServicesList services={categoryWithServices.services} />
						</Stack>
					</Accordion.Panel>
				</Accordion.Item>
			))}
		</Accordion>
	);
};
