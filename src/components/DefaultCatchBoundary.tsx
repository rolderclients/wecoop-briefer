import { Button, Group, Stack, Title } from '@mantine/core';
import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  return (
    <Stack
      align="center"
      justify="center"
      gap={0}
      h="100vh"
      ta="center"
      ml={160}
    >
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
          <Link to="/" preload="intent">
            <Button mt="xl" component="div" size="lg">
              На главную
            </Button>
          </Link>
        ) : (
          <Link to="/" preload="intent">
            <Button
              mt="xl"
              component="div"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              Назад
            </Button>
          </Link>
        )}
      </Group>
    </Stack>
  );
}
