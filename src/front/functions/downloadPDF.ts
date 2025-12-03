import { generatePDFFn } from '@/back/functions/generatePDFFn';
import { defaultErrorNotification } from '@/front';

// Интерфейсы для типизации 📝
interface PDFOptions {
	format?: 'A4' | 'A3' | 'Letter';
	margin?: {
		top?: string;
		bottom?: string;
		left?: string;
		right?: string;
	};
	printBackground?: boolean;
}

// Serializable Buffer type для TanStack
interface SerializableBuffer {
	data: number[];
	type: 'Buffer';
}

// Конвертация serializable формата в Uint8Array (клиентская сторона)
const serializableToUint8Array = (
	serializable: SerializableBuffer,
): Uint8Array => {
	return new Uint8Array(serializable.data);
};

// Утилита для безопасного создания Blob 🛡️
const createPDFBlob = (pdfData: Uint8Array): Blob => {
	try {
		// Создаем новый ArrayBuffer для совместимости
		const arrayBuffer = new ArrayBuffer(pdfData.length);
		const view = new Uint8Array(arrayBuffer);
		view.set(pdfData);
		return new Blob([arrayBuffer], { type: 'application/pdf' });
	} catch {
		throw new Error('Не удалось создать PDF blob');
	}
};

// Функция для скачивания с улучшенным error handling 📥
export const downloadPDF = async (
	html: string,
	fileName: string,
	options?: PDFOptions,
): Promise<void> => {
	// Валидация входных параметров
	if (!html || typeof html !== 'string' || html.trim().length === 0) {
		throw new Error('HTML контент не может быть пустым');
	}

	if (!fileName || typeof fileName !== 'string') {
		throw new Error('Имя файла должно быть указано');
	}

	// Добавляем расширение если его нет
	const finalFileName = fileName.endsWith('.pdf')
		? fileName
		: `${fileName}.pdf`;

	try {
		// console.log('downloadPDF: 📤 Начинаем скачивание PDF:', finalFileName);

		// Получаем PDF buffer от сервера
		const serializedBuffer = await generatePDFFn({
			data: {
				htmlData: html,
				options,
			},
		});

		// Конвертируем в Uint8Array для браузера
		const pdfData = serializableToUint8Array(serializedBuffer);

		// Создаем безопасный Blob
		const pdfBlob = createPDFBlob(pdfData);

		// Создаем URL для скачивания
		const url = URL.createObjectURL(pdfBlob);

		try {
			// Создаем и настраиваем ссылку для скачивания
			const link = document.createElement('a');
			link.href = url;
			link.download = finalFileName;
			link.style.display = 'none';

			// Добавляем в DOM, кликаем и удаляем
			document.body.appendChild(link);
			link.click();

			// Небольшая задержка перед удалением для корректной работы
			setTimeout(() => {
				document.body.removeChild(link);
			}, 100);

			// console.log('downloadPDF: ✅ PDF успешно скачан:', finalFileName);
		} finally {
			// Освобождаем URL в любом случае
			URL.revokeObjectURL(url);
		}
	} catch (error) {
		console.error('downloadPDF: ❌ Ошибка при скачивании PDF:', error);
		defaultErrorNotification(error as Error);

		// Более детальная информация об ошибке
		if (error instanceof Error) {
			throw new Error(`downloadPDF: Не удалось скачать PDF: ${error.message}`);
		} else {
			throw new Error(
				'downloadPDF: Произошла неизвестная ошибка при скачивании PDF',
			);
		}
	}
};

// Экспортируем типы для использования в других файлах
export type { PDFOptions };
