import { Button, Stack, Text, Title } from '@mantine/core';
import { Link } from '~/ui';

export const DefaultNotFoundComponent = () => (
	<Stack align="center" justify="center" gap={0} ta="center" h="100vh">
		<Text c="dimmed" fw="bold">
			404
		</Text>
		<Title textWrap="balance" size={65}>
			Страница не найдена
		</Title>
		<Title order={3} ml={4} textWrap="balance" c="dimmed">
			Извините, но здесь нет страницы. Возможно она перемещена.
		</Title>
		<Link to="/">
			<Button mt="xl" component="div" size="lg" radius="md">
				На главную
			</Button>
		</Link>
	</Stack>
);
