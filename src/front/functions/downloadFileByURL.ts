export const downloadFileByURL = async (url: string, fileName: string) => {
	// Пробуем скачать через fetch для кросс-доменных ссылок
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const blob = await response.blob();

	// Создаем Object URL из blob
	const blobUrl = URL.createObjectURL(blob);

	// Создаем и настраиваем ссылку для скачивания
	const link = document.createElement('a');
	link.href = blobUrl;
	link.download = fileName;
	link.style.display = 'none';

	// Добавляем в DOM, кликаем и удаляем
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	// Освобождаем Object URL
	URL.revokeObjectURL(blobUrl);
};
