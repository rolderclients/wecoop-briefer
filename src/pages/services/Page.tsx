import { Stack } from '@mantine/core';
import { Panel } from './Panel';
// import { Categories } from './Categories';
import { ServicesProvider } from './Provider';

export const ServicesPage = () => (
	<ServicesProvider>
		<Stack py="xl">
			<Panel />
			{/*<Categories />*/}
		</Stack>
	</ServicesProvider>
);
