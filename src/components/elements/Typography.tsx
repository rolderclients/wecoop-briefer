import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends PropsWithChildren {
	className?: string;
	variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

export const Text = ({ className, variant, ...props }: TextProps) => {
	const Component = variant || 'p';
	const getStyles = () => {
		switch (Component) {
			case 'h1':
				return 'text-6xl font-bold text-balance';
			case 'h2':
				return 'text-5xl font-bold text-balance';
			case 'h3':
				return 'text-4xl font-bold text-balance';
			case 'h4':
				return 'text-3xl font-bold text-balance';
			case 'h5':
				return 'text-2xl font-bold text-balance';
			case 'h6':
				return 'text-xl font-bold text-balance';
			case 'p':
				return 'text-base text-balance';
			case 'span':
				return 'text-base text-balance';
			default:
				return 'text-base text-balance';
		}
	};

	return <Component className={cn(getStyles(), className)} {...props} />;
};
