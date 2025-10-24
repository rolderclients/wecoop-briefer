import { Button, Title } from '@mantine/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'redaxios';
import { Page } from '@/components';
import type { Service } from '@/db';

const backendURL = process.env.BACKEND_URL;

const servicesQueryOptions = () =>
  queryOptions<Service[]>({
    queryKey: ['services'],
    queryFn: () =>
      axios
        .get<Array<Service>>(`${backendURL}/api/services`)
        .then((r) => r.data)
        .catch(() => {
          throw new Error('Failed to fetch services');
        }),
  });

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(servicesQueryOptions());
  },
  component: Home,
});

function Home() {
  const { data, refetch } = useSuspenseQuery(servicesQueryOptions());

  return (
    <Page>
      <Title>{data[0].title}</Title>
      <Button
        onClick={async () => {
          const startTime = Date.now();
          await refetch();
          console.log(`Refetch took ${Date.now() - startTime}ms`);
        }}
      >
        refetch
      </Button>
    </Page>
  );
}
