import type { TextUIPart } from 'ai';
import { useEffect, useState } from 'react';
import { parsePart } from '@/app';

export const useChatMessage = (part: TextUIPart) => {
	const [parsedText, setParsedText] = useState('');

	useEffect(() => {
		parsePart(part).then((i) => setParsedText(i.chat));
	}, [part]);

	return parsedText;
};
