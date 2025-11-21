import { AppShell, Button } from '@mantine/core';
import { Outlet, useRouteContext } from '@tanstack/react-router';
import { ScrollArea } from '@/kit';
import { signIn, signOut, signUp, useSession } from './auth';
// import { useAuth } from './auth';
import { Navbar } from './Navbar';

export const Shell = () => {
	// const { authed } = useAuth();

	const { data: session } = useSession();
	// const s = useRouteContext({ from: '/_authed' });
	// console.log(s.user);

	return (
		<AppShell
			navbar={{
				width: 160,
				breakpoint: 0,
			}}
			// disabled={!authed}
		>
			<Navbar />

			<AppShell.Main>
				<ScrollArea h="100vh" px="xl">
					<Button
						onClick={async () => {
							const { data, error } = await signUp.email(
								{
									email: 'mail@decard.space',
									password: '123123123',
									name: 'John Doe',
									// role: 'admin',
									// image: 'https://example.com/image.jpg',
									// callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
								},
								{
									onRequest: (ctx) => {
										console.log('Requesting...', ctx);
										//show loading
									},
									onSuccess: (ctx) => {
										console.log('Success', ctx);
										//redirect to the dashboard or sign in page
									},
									onError: (ctx) => {
										console.log('Error', ctx);
										// display the error message
									},
								},
							);

							console.log(data, error);
						}}
					>
						Test signup
					</Button>

					<Button
						onClick={async () => {
							const { data, error } = await signIn.email({
								email: 'mail@decard.space',
								password: '123123123',
							});

							console.log(data, error);
						}}
					>
						Test signin
					</Button>

					<Button
						onClick={async () => {
							const { data, error } = await signOut();

							console.log(data, error);
						}}
					>
						Test signout
					</Button>

					{session?.user.email}
					{session?.user.role}

					<Outlet />
					<ScrollArea.ScrollButton />
				</ScrollArea>
			</AppShell.Main>
		</AppShell>
	);
};
