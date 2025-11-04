import { Stack } from '@mantine/core';
import { Panel } from './Panel';
import { PromptsProvider } from './PromptsProvider';
import { Services } from './Services';

export const PromptsPage = () => (
	<PromptsProvider>
		<Stack py="xl">
			<Panel />
			<Services />
		</Stack>
	</PromptsProvider>
);
