import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { fromDTO, fromDTOs, getDB } from '../db';
import type {
	CategoryWithServices,
	NewService,
	Service,
	UpdateService,
} from '../types';

const getServices = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

		const [result] = await db
			.query(
				`SELECT *
        FROM service
        WHERE archived == $archived
        ORDER BY title NUMERIC;`,
				{
					archived,
				},
			)
			.json()
			.collect<[Service[]]>();

		return result;
	});

export const servicesQueryOptions = (archived?: boolean) =>
	queryOptions<Service[]>({
		queryKey: ['services', archived],
		queryFn: () => getServices({ data: { archived } }),
	});

const getCategoriesWithServices = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

		const [result] = await db
			.query(
				`SELECT
          id,
          title,
          (
            SELECT *
            FROM id.services
            WHERE archived == $archived
            ORDER BY title NUMERIC
          ) AS services
        FROM category
        WHERE count(services[WHERE archived == $archived]) > 0
        ORDER BY title NUMERIC;`,
				{
					archived,
				},
			)
			.json()
			.collect<[CategoryWithServices[]]>();

		return result;
	});

export const categoriesWithServicesQueryOptions = (archived?: boolean) =>
	queryOptions<CategoryWithServices[]>({
		queryKey: ['categoriesWithServices', archived],
		queryFn: () => getCategoriesWithServices({ data: { archived } }),
	});

export const createService = createServerFn({ method: 'POST' })
	.inputValidator((data: { serviceData: NewService }) => data)
	.handler(async ({ data: { serviceData } }) => {
		const db = await getDB();

		const data = await fromDTO(serviceData);

		await db.query(`CREATE service CONTENT $data;`, {
			data,
		});
	});

export const updateService = createServerFn({ method: 'POST' })
	.inputValidator((data: { serviceData: UpdateService }) => data)
	.handler(async ({ data: { serviceData } }) => {
		const db = await getDB();

		const item = await fromDTO(serviceData);
		await db.query(`UPDATE $item.id MERGE $item;`, { item });
	});

export const updateServices = createServerFn({ method: 'POST' })
	.inputValidator((data: { servicesData: UpdateService[] }) => data)
	.handler(async ({ data: { servicesData } }) => {
		const db = await getDB();

		const items = await fromDTOs(servicesData);
		await db.query(`FOR $item IN $items { UPDATE $item.id MERGE $item };`, {
			items,
		});
	});

export const deleteServices = createServerFn({ method: 'POST' })
	.inputValidator((data: { ids: string[] }) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data.ids);
		await db.query('FOR $id IN $ids { DELETE $id };', { ids });
	});
