import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getDB } from '../db';
import type { NewService, Service, UpdateService } from '../types';
import { fromDTO, fromDTOs, toDTO, toDTOs } from '../utils';

const getServices = createServerFn({ method: 'GET' })
  .inputValidator((data: { archived?: boolean }) => data)
  .handler(async ({ data: { archived = false } }) => {
    const db = await getDB();

    const [result] = await db
      .query(
        'SELECT *, category.title as categoryTitle FROM service WHERE archived = $archived ORDER BY categoryTitle, title;',
        {
          archived,
        },
      )
      .collect<[Service[]]>();

    return toDTOs(result);
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

    const data = fromDTO(serviceData);
    const [result] = await db
      .query('CREATE service CONTENT $data', {
        data,
      })
      .collect<[Service]>();

    return toDTO(result);
  });

export const updateService = createServerFn({ method: 'POST' })
  .inputValidator((data: { serviceData: UpdateService }) => data)
  .handler(async ({ data: { serviceData } }) => {
    const db = await getDB();

    const item = fromDTO(serviceData);
    const [result] = await db
      .query('UPDATE $item.id MERGE $item', { item })
      .collect<[Service]>();

    return toDTO(result);
  });

export const updateServices = createServerFn({ method: 'POST' })
  .inputValidator((data: { servicesData: UpdateService[] }) => data)
  .handler(async ({ data: { servicesData } }) => {
    const db = await getDB();

    const items = fromDTO(servicesData);
    const [, result] = await db
      .query(
        `FOR $item IN $items { UPDATE $item.id MERGE $item };
  RETURN $items.id.*;`,
        { items },
      )
      .collect<[undefined, [Service]]>();

    return toDTOs(result);
  });

export const deleteServices = createServerFn({ method: 'POST' })
  .inputValidator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    const db = await getDB();

    const ids = fromDTOs(data.ids);
    await db.query('FOR $id IN $ids { DELETE $id };', { ids });
  });
