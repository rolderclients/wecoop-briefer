import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import type {
	CreateTask,
	Task,
	TaskWithBriefAndChat,
	UpdateTask,
} from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getTasksFn = createServerFn({ method: 'GET' })
	.inputValidator((data: { archived: boolean }) => data)
	.handler(async ({ data: { archived = false } }) => {
		const db = await getDB();

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

export const tasksQueryOptions = (archived: boolean) =>
	queryOptions<Task[]>({
		queryKey: ['tasks', archived],
		queryFn: () => getTasksFn({ data: { archived } }),
	});

const getTaskWithBriefAndChatFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const id = await fromDTO(data);
		const [result] = await db
			.query(surql`SELECT
          *,
          service.{ id, title },
          brief.{ id, content },
          chat.{ id, messages },
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
			.collect<[TaskWithBriefAndChat]>();

		return result;
	});

export const taskWithBriefAndChatQueryOptions = (taskId: string) =>
	queryOptions<TaskWithBriefAndChat>({
		queryKey: ['taskWithBriefAndChat', taskId],
		queryFn: () => getTaskWithBriefAndChatFn({ data: taskId }),
	});

export const createTaskFn = createServerFn({ method: 'POST' })
	.inputValidator((data: CreateTask) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const content = await fromDTO(data);
		await db.query(surql`CREATE task CONTENT ${content};`);
	});

export const updateTaskFn = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdateTask) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const item = await fromDTO(data);
		await db.update(item.id).merge(item);
	});

export const updateTasksFn = createServerFn({ method: 'POST' })
	.inputValidator((data: UpdateTask[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const items = await fromDTOs(data);
		await db.query(
			surql`FOR $item IN ${items} { UPDATE $item.id MERGE $item };`,
		);
	});

export const deleteTasksFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string[]) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const ids = await fromDTOs(data);
		await db.query(surql`FOR $id IN ${ids} { DELETE $id };`);
	});
