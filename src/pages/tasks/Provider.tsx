import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';
import { createContext, type ReactNode, useContext } from 'react';
import { type Task, tasksQueryOptions } from '@/api';

interface TasksContext {
	tasks: Task[];
}

const TasksContext = createContext<TasksContext | null>(null);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
	const { archived: initialArchived } = useSearch({ from: '/tasks/' });
	const { data: tasks } = useSuspenseQuery(tasksQueryOptions(initialArchived));

	const value = { tasks };

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
