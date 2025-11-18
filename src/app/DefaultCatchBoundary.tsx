import { Button, Group, Stack, Title } from '@mantine/core';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';

export const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	return (
		<Stack align="center" justify="center" gap={0} ta="center" h="100vh">
			<Title textWrap="balance" size={65}>
				Произошла ошибка!
			</Title>
			{error.message && (
				<Title
					order={3}
					ml={4}
					textWrap="balance"
					c="var(--mantine-color-error)"
				>
					{error.message}
				</Title>
			)}

			<Group>
				<Button
					mt="xl"
					size="lg"
					variant="light"
					onClick={() => {
						router.invalidate();
					}}
				>
					Попробовать еще раз
				</Button>
				{isRoot ? (
					<Link to="/">
						<Button mt="xl" component="div" size="lg" radius="md">
							На главную
						</Button>
					</Link>
				) : (
					<Button
						mt="xl"
						radius="md"
						size="lg"
						onClick={(e) => {
							e.preventDefault();
							router.history.back();
						}}
					>
						Назад
					</Button>
				)}
			</Group>
		</Stack>
	);
};
