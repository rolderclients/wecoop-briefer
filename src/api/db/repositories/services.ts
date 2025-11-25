import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import type {
	CategoryWithServices,
	CreateService,
	Service,
	UpdateService,
} from '@/app';
// import { authMiddleware } from '@/app/auth/middleware';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getServicesFn = createServerFn({ method: 'GET' })
	// .middleware([authMiddleware])
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

		const [result] = await db
			.query(surql`SELECT *
        FROM service
        WHERE ${eq('archived', archived)}
        ORDER BY title NUMERIC;`)
			.json()
			.collect<[Service[]]>();

		return result;
	});

export const servicesQueryOptions = (archived?: boolean) =>
	queryOptions<Service[]>({
		queryKey: ['services', archived],
		queryFn: () => getServicesFn({ data: { archived } }),
	});

const getCategoriesWithServicesFn = createServerFn({ method: 'GET' })
	// .middleware([authMiddleware])
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

		const [result] = await db
			.query(surql`SELECT
          id,
          title,
          (
            SELECT *
            FROM id.services
            WHERE ${eq('archived', archived)}
            ORDER BY title NUMERIC
          ) AS services
        FROM category
        WHERE count(services[WHERE ${eq('archived', archived)}]) > 0
        ORDER BY title NUMERIC;`)
			.json()
			.collect<[CategoryWithServices[]]>();

		return result;
	});

export const categoriesWithServicesQueryOptions = (archived?: boolean) =>
	queryOptions<CategoryWithServices[]>({
		queryKey: ['categoriesWithServices', archived],
		queryFn: () => getCategoriesWithServicesFn({ data: { archived } }),
	});

export const createServiceFn = createServerFn({ method: 'POST' })
	// .middleware([authMiddleware])
	.inputValidator((data: CreateService) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const content = await fromDTO(data);
		await db.query(surql`CREATE service CONTENT ${content};`);
	});

export const updateServiceFn = createServerFn({ method: 'POST' })
	// .middleware([authMiddleware])
	.inputValidator((data: UpdateService) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const item = await fromDTO(data);
		await db.update(item.id).merge(item);
	});

export const updateServicesFn = createServerFn({ method: 'POST' })
	// .middleware([authMiddleware])
	.inputValidator((data: UpdateService[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const items = await fromDTOs(data);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deleteServicesFn = createServerFn({ method: 'POST' })
	// .middleware([authMiddleware])
	.inputValidator((data: string[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
