import type { ErrorComponentProps } from '@tanstack/react-router';
import { Link, rootRouteId, useMatch, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Text } from './elements';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	return (
		<div className="flex flex-col items-center justify-center h-screen text-center gap-0">
			<Text variant="h1">Произошла ошибка!</Text>
			{error.message && (
				<Text variant="h6" className="mt-4 text-destructive">
					{error.message}
				</Text>
			)}

			<div className="flex gap-4 mt-12">
				<Button
					size="lg"
					variant="outline"
					onClick={() => {
						router.invalidate();
					}}
				>
					Попробовать еще раз
				</Button>
				{isRoot ? (
					<Link to="/" preload="intent">
						<Button size="lg" asChild>
							<div>На главную</div>
						</Button>
					</Link>
				) : (
					<Link to="/" preload="intent">
						<Button
							size="lg"
							asChild
							onClick={(e) => {
								e.preventDefault();
								window.history.back();
							}}
						>
							<div>Назад</div>
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
