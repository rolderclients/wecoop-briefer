import { createFileRoute } from '@tanstack/react-router';
import { Page } from '@/components';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return <Page>HOME</Page>;
}
