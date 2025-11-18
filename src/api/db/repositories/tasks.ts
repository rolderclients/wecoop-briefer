import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import { getDbSession } from '../session';
import type { Task, TaskWithBrief } from '../types';
import { fromDTO } from '../utils';

const getTasks = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDbSession();

		const [result] = await db
			.query(surql`SELECT
          *,
          service.{ id, title }
        FROM task
        WHERE ${eq('archived', archived)}
        ORDER BY title NUMERIC;`)
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
		const db = await getDbSession();

		const id = await fromDTO(taskId);
		const [result] = await db
			.query(surql`SELECT
          *,
          service.{ id, title },
          brief.{ id, content },
          service.prompts[WHERE enabled == true]?[0].{
            id,
            title,
            content,
            model.{
              id,
              name,
              title
            }
          } as prompt
        FROM ONLY ${id}`)
			.json()
			.collect<[TaskWithBrief]>();

		return result;
	});

export const taskWithBriefQueryOptions = (taskId: string) =>
	queryOptions<TaskWithBrief>({
		queryKey: ['taskWithBrief'],
		queryFn: () => getTask({ data: { taskId } }),
	});
