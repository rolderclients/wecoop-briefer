import {
	ActionIcon,
	AppShell,
	Affix as MantineAffix,
	Transition,
} from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { Outlet } from '@tanstack/react-router';
import { ScrollArea, useScrollArea } from '@/components';

export const Page = () => (
	<AppShell.Main>
		<ScrollArea h="100vh">
			<ScrollArea.Content px="xl">
				<Outlet />
			</ScrollArea.Content>

			<Affix />
		</ScrollArea>
	</AppShell.Main>
);

const Affix = () => {
	const { scrollToTop, isNearTop } = useScrollArea();

	return (
		<MantineAffix position={{ bottom: 12, right: 18 }}>
			<Transition transition="slide-up" mounted={!isNearTop}>
				{(transitionStyles) => (
					<ActionIcon style={transitionStyles} onClick={() => scrollToTop()}>
						<IconArrowUp strokeWidth={1.5} />
					</ActionIcon>
				)}
			</Transition>
		</MantineAffix>
	);
};
