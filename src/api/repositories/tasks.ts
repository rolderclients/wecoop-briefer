import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { fromDTO, getDB } from '../db';
import type { Task, TaskWithBrief } from '../types';

const getTasks = createServerFn({ method: 'GET' })
  .inputValidator((data: { archived?: boolean }) => data)
  .handler(async ({ data: { archived = false } }) => {
    const db = await getDB();

    const [result] = await db
      .query(
        `SELECT
          *,
          service.{ id, title }
        FROM task
        WHERE archived == $archived
        ORDER BY title NUMERIC;`,
        {
          archived,
        },
      )
      .json()
      .collect<[Task[]]>();

    return result;
  });

export const tasksQueryOptions = (archived?: boolean) =>
  queryOptions<Task[]>({
    queryKey: ['tasks', archived],
    queryFn: () => getTasks({ data: { archived } }),
  });

export const getTask = createServerFn({ method: 'POST' })
  .inputValidator((data: { taskId: string }) => data)
  .handler(async ({ data: { taskId } }) => {
    const db = await getDB();

    const id = await fromDTO(taskId);
    const [result] = await db
      .query(
        `SELECT
          *,
          service.{ id, title },
          brief.{ id, content }
        FROM ONLY $id`,
        { id },
      )
      .json()
      .collect<[TaskWithBrief]>();

    return result;
  });

export const taskWithBriefQueryOptions = (taskId: string) =>
  queryOptions<TaskWithBrief>({
    queryKey: ['taskWithBrief'],
    queryFn: () => getTask({ data: { taskId } }),
  });
