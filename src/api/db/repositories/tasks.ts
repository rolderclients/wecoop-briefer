import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import { authMiddleware } from '@/app';
import { getDBFn } from '../connection';
import type { Task, TaskWithBrief } from '../types';
import { fromDTO } from '../utils';

const getTasksFn = createServerFn({ method: 'GET' })
	.middleware([authMiddleware])
	.inputValidator((data: { archived?: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDBFn();

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
		queryFn: () => getTasksFn({ data: { archived } }),
	});

export const getTaskFn = createServerFn({ method: 'POST' })
	.middleware([authMiddleware])
	.inputValidator((data: { taskId: string }) => data)
	.handler(async ({ data: { taskId } }) => {
		const db = await getDBFn();

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
		queryFn: () => getTaskFn({ data: { taskId } }),
	});
