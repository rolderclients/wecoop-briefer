import { Button, Stack, Title } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export const Forbidden = () => (
	<Stack align="center" justify="center" gap={0} ta="center" h="100vh">
		<Title textWrap="balance" size={65}>
			Доступ запрещен!
		</Title>

		<Title order={3} ml={4} textWrap="balance" c="var(--mantine-color-error)">
			У вас нет доступа к этой странице
		</Title>

		<Link to="/">
			<Button mt="xl" component="div" size="lg" radius="md">
				На главную
			</Button>
		</Link>
	</Stack>
);
