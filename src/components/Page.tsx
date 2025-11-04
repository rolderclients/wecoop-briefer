import { useWindowScroll } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';

export const Page = ({ children, ...props }: AppShellMainProps) => {
	const [scroll, scrollTo] = useWindowScroll();

	return (
		<AppShell.Main {...props}>
			{children}
			<Affix position={{ bottom: 18, right: 18 }}>
				<Transition transition="slide-up" mounted={scroll.y > 0}>
					{(transitionStyles) => (
						<ActionIcon
							style={transitionStyles}
							onClick={() => scrollTo({ y: 0 })}
						>
							<IconArrowUp strokeWidth={1.5} />
						</ActionIcon>
					)}
				</Transition>
			</Affix>
		</AppShell.Main>
	);
};
