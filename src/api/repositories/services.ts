import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getDB } from '../db';
import type { NewService, Service, UpdateService } from '../types';
import { fromDTO, fromDTOs, toDTO, toDTOs } from '../utils';

const getServices = createServerFn({ method: 'GET' })
  .inputValidator((data: { archived?: boolean }) => data)
  .handler(async ({ data: { archived = false } }) => {
    const db = await getDB();

    const result = await db.query<[Service[]]>(
      'SELECT *, category.title as categoryTitle FROM service WHERE archived = $archived ORDER BY categoryTitle, title;',
      {
        archived,
      },
    );

    return toDTOs(result[0]);
  });

export const servicesQueryOptions = (archived?: boolean) =>
  queryOptions<Service[]>({
    queryKey: ['services', archived],
    queryFn: () => getServices({ data: { archived } }),
  });

export const createService = createServerFn({ method: 'POST' })
  .inputValidator((data: { serviceData: NewService }) => data)
  .handler(async ({ data: { serviceData } }) => {
    const db = await getDB();

    const i = fromDTO(serviceData);
    const result = await db.query<Service[]>('CREATE service CONTENT $i', {
      i,
    });

    return toDTO(result[0]);
  });

export const updateService = createServerFn({ method: 'POST' })
  .inputValidator((data: { serviceData: UpdateService }) => data)
  .handler(async ({ data: { serviceData } }) => {
    const db = await getDB();

    const i = fromDTO(serviceData);

    const result = await db.query<Service[]>('UPDATE $i.id MERGE $i', { i });

    return toDTO(result[0]);
  });

export const updateServices = createServerFn({ method: 'POST' })
  .inputValidator((data: { servicesData: UpdateService[] }) => data)
  .handler(async ({ data: { servicesData } }) => {
    const db = await getDB();

    const items = fromDTO(servicesData);

    const result = await db.query<[undefined, Service[]]>(
      `FOR $item IN $items { UPDATE $item.id MERGE $item };
  RETURN $items.id.*;`,
      { items },
    );

    return toDTOs(result[1]);
  });

export const deleteServices = createServerFn({ method: 'POST' })
  .inputValidator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    const db = await getDB();

    const ids = fromDTOs(data.ids);

    await db.query('FOR $id IN $ids { DELETE $id };', { ids });
  });
