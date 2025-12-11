import { queryOptions } from '@tanstack/react-query';
import { createServerFn } from '@tanstack/react-start';
import { eq, surql } from 'surrealdb';
import type {
	CreateTask,
	Task,
	TaskWithBriefAndChat,
	TaskWithBriefAndComments,
	UpdateTask,
} from '@/types';
import { getDB } from '..';
import { fromDTO, fromDTOs } from '../utils';

const getTasksFn = createServerFn({ method: 'GET' })
	.inputValidator(
		(data: { archived: boolean; searchString?: string | undefined }) => data,
	)
	.handler(async ({ data: { archived, searchString } }) => {
		const db = await getDB();

		if (searchString) {
			const [result] = await db
				.query(surql`SELECT
			       *,
			       service.{ id, title }
			    FROM task
					WHERE ${eq('archived', archived)} AND title @@ ${searchString}
					ORDER BY time.created DESC;
			  `)
				.json()
				.collect<[Task[]]>();

			return result;
		}

		const [result] = await db
			.query(surql`SELECT
          *,
          service.{ id, title }
        FROM task
        WHERE ${eq('archived', archived)}
        ORDER BY time.created DESC;`)
			.json()
			.collect<[Task[]]>();

		return result;
	});

export const tasksQueryOptions = (
	archived: boolean,
	searchString?: string | undefined,
) =>
	queryOptions<Task[]>({
		queryKey: ['tasks', archived, searchString],
		queryFn: () => getTasksFn({ data: { archived, searchString } }),
	});

const getTaskWithBriefAndChatFn = createServerFn({ method: 'POST' })
	.inputValidator((data: { id: string; archived: boolean }) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		const { id, archived } = await fromDTO(data);
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
        FROM ONLY ${id}
        WHERE ${eq('archived', archived)}`)
			.json()
			.collect<[TaskWithBriefAndChat]>();

		return result;
	});

export const taskWithBriefAndChatQueryOptions = (data: {
	id: string;
	archived: boolean;
}) =>
	queryOptions<TaskWithBriefAndChat>({
		queryKey: ['taskWithBriefAndChat', data.id, data.archived],
		queryFn: () => getTaskWithBriefAndChatFn({ data }),
	});

const getTaskWithBriefAndCommentsFn = createServerFn({ method: 'POST' })
	.inputValidator((data: string) => data)
	.handler(async ({ data }) => {
		const db = await getDB();

		// Вот это место надо поправить, так как при открытии страницы в surreal улетает такой странный id и запрос зависает
		const taskId = await fromDTO(data);
		const [result] = await db
			.query(surql`SELECT
          *,
	        service.{ id, title },
	        brief.{ id, content },
					(SELECT * FROM comments.* ORDER BY time.created) as comments
        FROM ONLY ${taskId}
        `)
			.json()
			.collect<[TaskWithBriefAndComments]>();

		return result;
	});

export const taskWithBriefAndCommentsQueryOptions = (taskId: string) =>
	queryOptions<TaskWithBriefAndComments>({
		queryKey: ['taskWithBriefAndComments', taskId],
		queryFn: () => getTaskWithBriefAndCommentsFn({ data: taskId }),
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
