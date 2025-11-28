import z from 'zod/v4';

export const filedsSchema = {
	id: z.string(),
	name: z.string().min(3, 'Имя должно содержать не менее 3 символов'),
	email: z.email('Неверный формат email'),
	role: z.enum(['manager', 'admin']),
	username: z.string().min(3, 'Логин должен содержать не менее 3 символов'),
	password: z.string().min(8, 'Пароль должен содержать не менее 8 символов'),
	title: z.string().min(3, 'Название должно содержать не менее 3 символов'),
};
