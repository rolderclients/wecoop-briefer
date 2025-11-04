import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Text } from './elements';

export const DefaultNotFound = () => (
	<div className="flex flex-col items-center justify-center gap-0 text-center h-screen">
		<Text variant="h6" className="text-muted-foreground">
			404
		</Text>
		<Text variant="h1">Страница не найдена</Text>
		<Text variant="h6" className="text-muted-foreground mt-4">
			Извините, но здесь нет страницы. Возможно она перемещена.
		</Text>

		<Button size="lg" asChild>
			<Link to="/" className="mt-12">
				На главную
			</Link>
		</Button>
	</div>
);
