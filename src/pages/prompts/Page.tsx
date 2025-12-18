import { Stack } from '@mantine/core';
import { Accordions, Panel } from './components';
import { Edit } from './forms';
import { PromptsProvider } from './Provider';

export const PromptsPage = () => {
	return (
		<PromptsProvider>
			<Stack py="xl">
				<Panel />
				<Accordions />

				<Edit />
			</Stack>
		</PromptsProvider>
	);
};
