import type { ModelName } from '@/back';

export interface Item {
	id: string;
	time: {
		created: string;
		updated: string;
	};
}

// Category

export interface Category extends Item {
	title: string;
	services: string[];
}

export interface CreateCategory {
	title: string;
}

export interface UpdateCategory {
	id: string;
	title?: string;
}

// Service

export interface Service extends Item {
	title: string;
	category: string;
	archived: boolean;
}

export interface CategoryWithServices extends Item {
	title: string;
	services: Service[];
}

export interface CreateService {
	title: string;
	category: string;
}

export interface UpdateService {
	id: string;
	title?: string;
	category?: string;
	archived?: boolean;
}

// AI Model

export interface Model extends Item {
	name: ModelName;
	title: string;
}

// Prompt

export interface Prompt extends Item {
	title: string;
	content?: string;
	service: string;
	model: Model;
	enabled: boolean;
	archived: boolean;
}

export interface ServiceWithPrompts extends Item {
	title: string;
	prompts: Prompt[];
}

export interface CreatePrompt {
	title: string;
	service: string;
	model: string;
}

export interface UpdatePrompt {
	id: string;
	title?: string;
	content?: string;
	service?: string;
	model?: string;
	enabled?: boolean;
	archived?: boolean;
}

// Brief

export interface Brief extends Item {
	content: string;
}

export interface UpdateBrief {
	id: string;
	content: string;
}

// Task

export interface Task extends Item {
	title: string;
	content?: string;
	brief: string;
	company: {
		title?: string;
		info?: string;
	};
	service: Pick<Service, 'id' | 'title'>;
	prompt: Pick<Prompt, 'id' | 'title' | 'content'> & {
		model: Pick<Model, 'id' | 'name' | 'title'>;
	};
	archived: boolean;
}

export interface TaskWithBrief extends Omit<Task, 'brief'> {
	brief: Brief;
}

export interface CreateTask {
	title: string;
	content?: string;
	company?: {
		title?: string;
		info?: string;
	};
	service: string;
}

export interface UpdateTask {
	id: string;
	title?: string;
	content?: string;
	company?: {
		title?: string;
		info?: string;
	};
	service?: string;
	archived?: boolean;
}
