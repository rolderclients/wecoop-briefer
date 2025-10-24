import { createFileRoute } from '@tanstack/react-router';
import { json } from '@tanstack/react-start';
import { servicesRepository } from '@/db';

export const Route = createFileRoute('/api/services')({
  server: {
    handlers: {
      GET: async () => {
        const services = await servicesRepository.getServices();

        return json(services);
      },
    },
  },
});
