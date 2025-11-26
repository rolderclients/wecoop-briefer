import type { ModelName } from '@/api';

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
