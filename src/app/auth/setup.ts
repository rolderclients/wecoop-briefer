import { auth } from '@/lib';

const username = process.env.AUTH_ROOT_USERNAME;
const password = process.env.AUTH_ROOT_PASSWORD;

if (!password || !username) {
	throw new Error(
		'AUTH_ROOT_PASSWORD or AUTH_ROOT_USERNAME environment variable is not set',
	);
}

auth.api.createUser({
	body: {
		email: 'mail@rolder.dev',
		name: 'Системная учетная запись',
		password,
		role: 'admin',
		data: { username, displayUsername: 'Root' },
	},
});
