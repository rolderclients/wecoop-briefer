import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const generatePDF = async (htmlData: string) => {
  // Созадем экземпляр брацузера
  const browser = await puppeteer.launch({
    executablePath: await chromium.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

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
};
