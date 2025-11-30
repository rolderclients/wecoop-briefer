export const downloadPDFFromServer = async (
  html: string,
  fileName: string = "brief.pdf",
): Promise<void> => {
  try {
    // Отправляем POST запрос на сервер с HTML данными
    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Получаем PDF как blob
    const pdfBlob = await response.blob();

    // Создаем URL для скачивания
    const url = window.URL.createObjectURL(pdfBlob);

    // Создаем временную ссылку для скачивания
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);

    // Запускаем скачивание
    link.click();

    // Очищаем ресурсы
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Ошибка при скачивании PDF:", error);
    throw error;
  }
};
