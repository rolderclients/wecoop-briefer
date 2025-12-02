import chromium from "@sparticuz/chromium";
import { createServerFn } from "@tanstack/react-start";
import puppeteer from "puppeteer-core";

// Крутится на сервере и формирует pdfBuffer из htnl
const generatePDF = createServerFn({ method: "POST" })
  .inputValidator((htmlData: string) => htmlData)
  .handler(async (htmlData): Promise<any> => {
    // Созадем экземпляр брацузера
    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("htmlData", htmlData);

    // Создаем новую страницу в браузере
    const page = await browser.newPage();

    // Устанавливаем настройки страницы А4
    await page.setViewport({ width: 1024, height: 768 });

    // Устанавливаем контент страницы
    await page.setContent(htmlData);

    // Устанавливаем настройки PDF
    await page.emulateMediaType("screen");

    // Устанавливаем настройки PDF
    // await page.emulateMediaFeatures([
    // { name: "color", value: "1" },
    // { name: "color-index", value: "0" },
    // { name: "monochrome", value: "0" },
    // { name: "resolution", value: "300dpi" },
    // ]);

    // Создаем PDF buffer
    const pdfBuffer = await page.pdf({ format: "A4" });

    // Завершаем экземпляр
    await browser.close();

    // Возвращаем буффер PDF файла
    return pdfBuffer;
  });

// Рабоатет на клиенте и передает html в функцию, а затем скачивает PDF файл
export const downloadPDF = async (html: string, fileName: string) => {
  try {
    // Получаем PDF как blob
    const pdfBuffer = await generatePDF(html);

    const arrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength,
    );

    // Создаем Blob из ArrayBuffer
    const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });

    // Создаем URL для скачивания
    const url = URL.createObjectURL(pdfBlob);

    // Создаем временную ссылку для скачивания
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);

    // Запускаем скачивание
    link.click();

    // Очищаем ресурсы
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Ошибка при скачивании PDF:", error);
    throw error;
  }
};
