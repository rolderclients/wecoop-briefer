import { Editor } from '../reusables';

export const SimpleEditor = ({
	height = '100%',
	initialContent,
	initialEditable,
	initialDisabledToolbar,
	saving,
	onChange,
}: {
	height?: string;
	initialContent?: string;
	initialEditable?: boolean;
	initialDisabledToolbar?: boolean;
	saving?: boolean;
	onChange?: (content: string) => void;
}) => (
	<Editor.Provider
		initialContent={initialContent}
		initialEditable={initialEditable}
		initialDisabledToolbar={initialDisabledToolbar}
		onChange={onChange}
	>
		<Editor.Root>
			<Editor.Toolbar saving={saving} />
			<Editor.Content height={height} />
		</Editor.Root>
	</Editor.Provider>
);
