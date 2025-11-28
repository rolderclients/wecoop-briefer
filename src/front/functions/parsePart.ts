import { parsePartialJson, type TextUIPart } from 'ai';
import type { StructuredTextPart } from '@/back';

export const parsePart = async (
	part: TextUIPart,
): Promise<StructuredTextPart> => {
	if (!part.text.startsWith('{')) {
		return { chat: part.text, document: '' };
	}

	try {
		// parsePartialJson возвращает промис с результатом
		// biome-ignore lint/suspicious/noExplicitAny: <parsePartialJson>
		const result = (await parsePartialJson(part.text)) as any;
		return result?.value || { text: part.text };
	} catch (error) {
		console.error('Error parsing partial JSON:', error);
		return { chat: part.text, document: '' }; // Fallback к исходному тексту
	}
};
