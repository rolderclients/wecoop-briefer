import { Stack } from '@mantine/core';
import { Accordions, Panel } from './components';
import { Edit } from './forms';
import { ServicesProvider } from './Provider';

export const ServicesPage = () => (
	<ServicesProvider>
		<Stack py="xl">
			<Panel />
			<Accordions />

			<Edit />
		</Stack>
	</ServicesProvider>
);
