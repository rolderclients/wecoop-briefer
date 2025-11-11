import type { ReactNode } from 'react';
import { Content } from './Content';
import { Provider } from './Provider';
import { Root } from './Root';
import { Toolbar } from './Toolbar';

export interface EditorProps {
	children: ReactNode;
	withProvider?: boolean;
	initialContent?: string;
	initialDisabledToolbar?: boolean;
	onChange?: (value: string) => void;
}

export const Editor = Object.assign(Root, {
	Content,
	Toolbar,
	Provider,
});

export { useEditor } from './Provider';
