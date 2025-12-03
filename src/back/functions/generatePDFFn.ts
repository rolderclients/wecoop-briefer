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

// Serializable Buffer тип
interface SerializableBuffer {
	data: number[];
	type: 'Buffer';
}

// Конфигурация браузера для оптимизации 🚀
const getBrowserConfig = async () => ({
	executablePath: await chromium.executablePath(),
	args: [
		// https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md
		// https://docs.google.com/spreadsheets/d/1n-vw_PCPS45jX3Jt9jQaAhFqBY6Ge1vWF_Pa0k7dCk4/edit?gid=1265672696#gid=1265672696
		// https://chromeflags.org/
		// Основные флаги безопасности
		'--headless', // Запускается в автономном режиме, то есть без пользовательского интерфейса или зависимостей от сервера отображения.
		'--no-sandbox', // Отключение изолированной среды, если полностью доверяете контенту, который открываете.
		// Оптимизация производительности ⚡
		'--disable-dev-shm-usage', // Эта опция позволяет браузеру использовать файловую систему для межпроцессорного взаимодействия вместо разделяемой памяти, которая часто ограничена в Docker контейнерах.
		'--no-first-run', // Пропустить мастера первого запуска
		'--no-zygote', //  полностью отключает использование процесса zygote. Это нужно для запуска браузера без заголовка (Headless Chrome) в средах, где поддержание процесса zygote не требуется или нецелесообразно. Должен использоваться совместно с --no-sandbox
		'--disable-web-security', // Отсключает CORS. Параметр --disable-web-security в команде запуска браузера Chromium отключает функции веб-безопасности, позволяя выполнять запросы из разных источников, которые обычно блокируются браузерами.
		// Экономия памяти 💾
		// '--memory-pressure-off', // Отключает мониторинг давления памяти. Это использует меньше ресурсов, что полезно в условиях ограниченной памяти. Но может пропустить сигналы о критическом давлении памяти.
		'--max_old_space_size=4096', // Увеличивает лимит памяти до 4 Гб, с 1,4 Гб для V8 JS.
		// Отключаем ненужные фичи
		'--disable-background-timer-throttling', // Отключаем ограничение времени для запуска вкладки и его отслеживания.
		'--disable-backgrounding-occluded-windows', // Отключает обработку фоновой вкладки.
		'--disable-renderer-backgrounding', // Отсключает снижение производительности фоновых вкладок, делая упор на производительности активной вкладки.
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
			// console.log('generatePDFFn: 🚀 Запуск генерации PDF...');

			// Создаем браузер с оптимизированными настройками
			const config = await getBrowserConfig();
			browser = await puppeteer.launch(config);

			// Создаем страницу
			page = await browser.newPage();

			// Настраиваем страницу
			await setupPage(page);

			// console.log('generatePDFFn: 📄 Загружаем HTML контент...');

			// Устанавливаем контент с таймаутом
			await page.setContent(data.htmlData, {
				waitUntil: ['networkidle0', 'domcontentloaded'],
				timeout: 30000, // 30 секунд таймаут
			});

			// Ждем загрузки всех ресурсов
			await page.evaluateHandle('document.fonts.ready');

			// console.log('generatePDFFn: 📋 Генерируем PDF...');

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

			// console.log('generatePDFFn: ✅ PDF успешно сгенерирован');
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
					// console.log('generatePDFFn: 📄 Страница закрыта');
				}
				if (browser) {
					await browser.close();
					// console.log('generatePDFFn: 🌐 Браузер закрыт');
				}
			} catch (cleanupError) {
				console.error(
					'generatePDFFn: ⚠️ Ошибка при очистке ресурсов:',
					cleanupError,
				);
			}
		}
	});
