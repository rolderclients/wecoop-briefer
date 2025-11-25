export interface Item {
	id: string;
	time: {
		created: string;
		updated: string;
	};
}

export interface Category extends Item {
	title: string;
	services: string[];
}

export interface CreateCategory {
	title: string;
}

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
