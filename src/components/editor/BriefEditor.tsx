import { Chip, Switch } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { type UpdateBrief, updateBrief } from '@/api';
import { useChat } from '../chat';
import { Editor, type EditorProps } from '.';

export const BriefEditor = ({
	briefId,
	...props
}: EditorProps & { briefId: string }) => {
	const { chatStatus } = useChat();

	// const { editedByUser, editable, setEditable, setSaving, setOnChangeHandler } =
	// 	useEditor();

	// useEffect(() => {
	// 	if (editable && chatStatus === 'ready') setEditable(true);
	// }, [editable, chatStatus, setEditable]);

	// const { mutate, status } = useMutation({
	// 	mutationFn: (briefData: UpdateBrief) =>
	// 		updateBrief({ data: { briefData } }),
	// });

	// useEffect(() => {
	// 	if (status === 'pending') setSaving(true);
	// 	else setSaving(false);
	// }, [status, setSaving]);

	// const debouncedUpdate = useDebouncedCallback(async (content: string) => {
	// 	mutate({ id: briefId, content });
	// }, 500);

	// useEffect(() => {
	// 	setOnChangeHandler(debouncedUpdate);
	// }, [setOnChangeHandler, debouncedUpdate]);

	return (
		<>
			{/*<Chip checked={editedByUser}>editedByUser</Chip>
			<Switch
				checked={editable}
				onChange={(e) => setEditable(e.currentTarget.checked)}
			/>*/}

			<Editor
				{...props}
				// content={content}
				// editable={editable && chatStatus === 'ready'}
				// onChange={(content) => {
				// setDocument(content);
				// onChange?.(content);
				// }}
				// onFocus={() => setEditedByUser(true)}
			/>
		</>
	);
};
