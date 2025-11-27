export interface EditorProps {
	children: React.ReactNode;
	initialContent?: string;
	initialEditable?: boolean;
	initialDisabledToolbar?: boolean;
	onChange?: (value: string) => void;
}
