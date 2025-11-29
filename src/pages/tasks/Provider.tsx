import { useDisclosure } from '@mantine/hooks';
import {
	type UseMutationResult,
	useSuspenseQuery,
} from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react';
import {
	createTaskFn,
	deleteTasksFn,
	servicesWithEnbledPromptsQueryOptions,
	tasksQueryOptions,
	updateTaskFn,
	updateTasksFn,
} from '@/back';
import { useMutaitionWithInvalidate } from '@/front';
import { Route } from '@/routes/_authed/tasks';
import type { CreateTask, ServiceWithPrompts, Task, UpdateTask } from '@/types';

interface TasksContext {
	tasks: Task[];
	services: ServiceWithPrompts[];
	createMutation: UseMutationResult<void, Error, CreateTask, unknown>;
	updateMutation: UseMutationResult<void, Error, UpdateTask, unknown>;
	updateManyMutation: UseMutationResult<void, Error, UpdateTask[], unknown>;
	deleteManyMutation: UseMutationResult<void, Error, string[], unknown>;
	selectedIds: string[];
	setSelectedIds: (ids: string[]) => void;
	selectedTask: Task | null;
	setSelectedTask: (task: Task | null) => void;
	isArchived: boolean;
	setIsArchived: (archived: boolean) => void;
	isCreateOpened: boolean;
	openCreate: () => void;
	closeCreate: () => void;
	isEditingOpened: boolean;
	openEdit: () => void;
	closeEdit: () => void;
}

const TasksContext = createContext<TasksContext | null>(null);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
	const { archived: initialArchived } = useSearch({ from: Route.id });
	const { data: tasks } = useSuspenseQuery(tasksQueryOptions(initialArchived));
	const { data: services } = useSuspenseQuery(
		servicesWithEnbledPromptsQueryOptions(),
	);

	const createMutation = useMutaitionWithInvalidate<CreateTask>(createTaskFn, [
		'tasks',
	]);
	const updateMutation = useMutaitionWithInvalidate<UpdateTask>(updateTaskFn, [
		'tasks',
	]);
	const updateManyMutation = useMutaitionWithInvalidate<UpdateTask[]>(
		updateTasksFn,
		['tasks'],
	);
	const deleteManyMutation = useMutaitionWithInvalidate<string[]>(
		deleteTasksFn,
		['tasks'],
	);

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [isArchived, setIsArchived] = useState(initialArchived || false);

	useEffect(() => {
		setIsArchived(initialArchived || false);
	}, [initialArchived]);

	const [isCreateOpened, { open: openCreate, close: closeCreate }] =
		useDisclosure(false);
	const [isEditingOpened, { open: openEdit, close: closeEdit }] =
		useDisclosure(false);

	const value = {
		tasks,
		services,
		createMutation,
		updateMutation,
		updateManyMutation,
		deleteManyMutation,
		selectedIds,
		setSelectedIds,
		selectedTask,
		setSelectedTask,
		isArchived,
		setIsArchived,
		isCreateOpened,
		openCreate,
		closeCreate,
		isEditingOpened,
		openEdit,
		closeEdit,
	};

	return (
		<TasksContext.Provider value={value}>{children}</TasksContext.Provider>
	);
};

export const useTasks = () => {
	const context = useContext(TasksContext);
	if (!context) {
		throw new Error('useTasks must be used within TasksProvider');
	}
	return context;
};
