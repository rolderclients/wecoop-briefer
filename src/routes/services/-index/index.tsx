import { Stack } from '@mantine/core';
import { Categories } from './Categories';
import { Panel } from './Panel';
import { ServicesProvider } from './ServicesProvider';

export const ServicesPage = () => (
	<ServicesProvider>
		<Stack py="xl">
			<Panel />
			<Categories />
		</Stack>
	</ServicesProvider>
);
