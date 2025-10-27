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

const getServicesWithPrompts = createServerFn({ method: 'GET' })
  .inputValidator((data: { archived?: boolean }) => data)
  .handler(async ({ data: { archived = false } }) => {
    const db = await getDB();

    const [result] = await db
      .query(
        `SELECT
            id,
            title,
            (
                SELECT *, model.{ id, name, title }
                FROM id.prompts
                WHERE archived == $archived
                ORDER BY title
            ) AS prompts
        FROM service
        WHERE count(prompts[WHERE archived == $archived]) > 0 AND archived == false
        ORDER BY title;`,
        {
          archived,
        },
      )
      .collect<[ServiceWithPrompts[]]>();

    return toDTOs(result);
  });

export const servicesWithPromptsQueryOptions = (archived?: boolean) =>
  queryOptions<ServiceWithPrompts[]>({
    queryKey: ['servicesWithPrompts', !!archived],
    queryFn: () => getServicesWithPrompts({ data: { archived } }),
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

export const updatePrompts = createServerFn({ method: 'POST' })
  .inputValidator((data: { promptsData: UpdatePrompt[] }) => data)
  .handler(async ({ data: { promptsData } }) => {
    const db = await getDB();

    const items = fromDTO(promptsData);
    const [, result] = await db
      .query(
        `FOR $item IN $items { UPDATE $item.id MERGE $item };
  RETURN $items.id.*;`,
        { items },
      )
      .collect<[undefined, Prompt[]]>();

    return toDTOs(result);
  });

export const deletePrompts = createServerFn({ method: 'POST' })
  .inputValidator((data: { ids: string[] }) => data)
  .handler(async ({ data }) => {
    const db = await getDB();

    const ids = fromDTOs(data.ids);
    await db.query('FOR $id IN $ids { DELETE $id };', { ids });
  });
