import { useEffect, useState } from 'react';
import type { AgentUIMessage } from '@/back';
import { parsePart } from '@/front';

export const useDocument = (messages: AgentUIMessage[]) => {
	const [parsedDocument, setParsedDocument] = useState('');

	useEffect(() => {
		const lastMessage = messages[messages.length - 1];
		const textParts = lastMessage?.parts?.filter((i) => i.type === 'text');
		const lastPart = textParts?.[textParts.length - 1] || { text: '' };
		parsePart(lastPart).then((i) => setParsedDocument(i.document));
	}, [messages]);

	return parsedDocument;
};
