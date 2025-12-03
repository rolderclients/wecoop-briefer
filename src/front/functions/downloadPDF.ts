import chromium from '@sparticuz/chromium';
import { createServerFn } from '@tanstack/react-start';
import puppeteer, { Browser, type Page } from 'puppeteer-core';
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

interface GeneratePDFInput {
	htmlData: string;
	options?: PDFOptions;
}

// Serializable Buffer type для TanStack
interface SerializableBuffer {
	data: number[];
	type: 'Buffer';
}

// Конфигурация браузера для оптимизации 🚀
const getBrowserConfig = async () => ({
	executablePath: await chromium.executablePath(),
	args: [
		// Основные флаги безопасности
		'--no-sandbox',
		'--disable-setuid-sandbox',

		// Оптимизация производительности ⚡
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--no-first-run',
		'--no-zygote',
		'--disable-gpu',
		'--disable-web-security',

		// Экономия памяти 💾
		'--memory-pressure-off',
		'--max_old_space_size=4096',

		// Отключаем ненужные фичи
		'--disable-background-timer-throttling',
		'--disable-backgrounding-occluded-windows',
		'--disable-renderer-backgrounding',
	],
});

// Дефолтные настройки PDF 📄
const DEFAULT_PDF_OPTIONS: PDFOptions = {
	format: 'A4',
	margin: {
		top: '20px',
		bottom: '20px',
		left: '80px',
		right: '20px',
	},
	printBackground: true,
};

// Валидация входных данных 🛡️
const validateInput = (data: any): data is GeneratePDFInput => {
	return (
		data &&
		typeof data === 'object' &&
		typeof data.htmlData === 'string' &&
		data.htmlData.trim().length > 0
	);
};

// Создание страницы с оптимальными настройками 🔧
const setupPage = async (page: Page): Promise<void> => {
	// Устанавливаем viewport для корректного рендеринга
	await page.setViewport({
		width: 1024,
		height: 768,
		deviceScaleFactor: 1,
	});

	// Эмулируем медиа для печати
	await page.emulateMediaType('print');

	// Отключаем изображения для ускорения (опционально)
	// await page.setRequestInterception(true);
	// page.on('request', (req) => {
	//   if(req.resourceType() == 'image'){
	//     req.abort();
	//   } else {
	//     req.continue();
	//   }
	// });
};

// Конвертация Buffer в serializable формат (серверная сторона)
const bufferToSerializable = (buffer: Buffer): SerializableBuffer => {
	return {
		data: Array.from(buffer),
		type: 'Buffer',
	};
};

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
	} catch (error) {
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
		console.log('📤 Начинаем скачивание PDF:', finalFileName);

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

			console.log('✅ PDF успешно скачан:', finalFileName);
		} finally {
			// Освобождаем URL в любом случае
			URL.revokeObjectURL(url);
		}
	} catch (error) {
		console.error('❌ Ошибка при скачивании PDF:', error);
		defaultErrorNotification(error as Error);

		// Более детальная информация об ошибке
		if (error instanceof Error) {
			throw new Error(`Не удалось скачать PDF: ${error.message}`);
		} else {
			throw new Error('Произошла неизвестная ошибка при скачивании PDF');
		}
	}
};

// Экспортируем типы для использования в других файлах
export type { PDFOptions, GeneratePDFInput };
