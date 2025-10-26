import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { getDB } from '../db';
import type {
  NewPrompt,
  Prompt,
  ServiceWithPrompts,
  UpdatePrompt,
} from '../types';
import { fromDTO, fromDTOs, toDTO, toDTOs } from '../utils';

const getServicesPrompts = createServerFn({ method: 'GET' })
  .inputValidator((data: { archived?: boolean }) => data)
  .handler(async ({ data: { archived = false } }) => {
    const db = await getDB();

    const [result] = await db
      .query(
        `SELECT id, title, prompts[WHERE archived == false][*].{
	id,
	title,
	content,
	enabled,
	service,
	model.{
	  id,
		name,
		title
	},
	time,
	archived
      } FROM service WHERE !prompts.is_empty() AND archived == false ORDER BY title;`,
        {
          archived,
        },
      )
      .collect<[ServiceWithPrompts[]]>();

    return toDTOs(result);
  });

export const servicesPromptsQueryOptions = (archived?: boolean) =>
  queryOptions<ServiceWithPrompts[]>({
    queryKey: ['prompts', archived],
    queryFn: () => getServicesPrompts({ data: { archived } }),
  });

export const createPrompt = createServerFn({ method: 'POST' })
  .inputValidator((data: { promptData: NewPrompt }) => data)
  .handler(async ({ data: { promptData } }) => {
    const db = await getDB();

    const data = fromDTO(promptData);
    const [result] = await db
      .query('CREATE prompt CONTENT $data', { data })
      .collect<[Prompt]>();

    return toDTO(result);
  });

export const updatePrompt = createServerFn({ method: 'POST' })
  .inputValidator((data: { promptData: UpdatePrompt }) => data)
  .handler(async ({ data: { promptData } }) => {
    const db = await getDB();

    const item = fromDTO(promptData);
    const [result] = await db
      .query('UPDATE $item.id MERGE $item', { item })
      .collect<[Prompt]>();

    return toDTO(result);
  });

// export const updateServices = createServerFn({ method: 'POST' })
//   .inputValidator((data: { servicesData: UpdateService[] }) => data)
//   .handler(async ({ data: { servicesData } }) => {
//     const db = await getDB();

//     const items = fromDTO(servicesData);

//     const result = await db.query<[undefined, Service[]]>(
//       `FOR $item IN $items { UPDATE $item.id MERGE $item };
//   RETURN $items.id.*;`,
//       { items },
//     );

//     return toDTOs(result[1]);
//   });

// export const deleteServices = createServerFn({ method: 'POST' })
//   .inputValidator((data: { ids: string[] }) => data)
//   .handler(async ({ data }) => {
//     const db = await getDB();

//     const ids = fromDTOs(data.ids);

//     await db.query('FOR $id IN $ids { DELETE $id };', { ids });
//   });
