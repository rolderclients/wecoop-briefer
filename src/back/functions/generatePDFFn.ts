import chromium from '@sparticuz/chromium';
import { createServerFn } from '@tanstack/react-start';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';

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

// Основная функция генерации PDF 🎯
export const generatePDFFn = createServerFn({ method: 'POST' })
	.inputValidator((data: { htmlData: string; options?: PDFOptions }) => data)
	.handler(async ({ data }): Promise<SerializableBuffer> => {
		let browser: Browser | null = null;
		let page: Page | null = null;

		try {
			console.log('🚀 Запуск генерации PDF...');

			// Создаем браузер с оптимизированными настройками
			const config = await getBrowserConfig();
			browser = await puppeteer.launch(config);

			// Создаем страницу
			page = await browser.newPage();

			// Настраиваем страницу
			await setupPage(page);

			console.log('📄 Загружаем HTML контент...');

			// Устанавливаем контент с таймаутом
			await page.setContent(data.htmlData, {
				waitUntil: ['networkidle0', 'domcontentloaded'],
				timeout: 30000, // 30 секунд таймаут
			});

			// Ждем загрузки всех ресурсов
			await page.evaluateHandle('document.fonts.ready');

			console.log('📋 Генерируем PDF...');

			// Объединяем дефолтные и пользовательские настройки
			const pdfOptions = {
				...DEFAULT_PDF_OPTIONS,
				...data.options,
			};

			// Создаем PDF buffer с оптимизированными настройками
			const pdfBuffer = await page.pdf({
				format: pdfOptions.format,
				margin: pdfOptions.margin,
				printBackground: pdfOptions.printBackground,
				preferCSSPageSize: true,
				displayHeaderFooter: false,
				timeout: 60000, // 60 секунд для генерации PDF
			});

			console.log('✅ PDF успешно сгенерирован');
			return bufferToSerializable(Buffer.from(pdfBuffer));
		} catch (error) {
			console.error('❌ Ошибка при генерации PDF:', error);
			throw new Error(
				`Не удалось сгенерировать PDF: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
			);
		} finally {
			// Гарантированная очистка ресурсов 🧹
			try {
				if (page) {
					await page.close();
					console.log('📄 Страница закрыта');
				}
				if (browser) {
					await browser.close();
					console.log('🌐 Браузер закрыт');
				}
			} catch (cleanupError) {
				console.error('⚠️ Ошибка при очистке ресурсов:', cleanupError);
			}
		}
	});
