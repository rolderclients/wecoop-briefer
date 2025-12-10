export const downloadFileByURL = (url: string, fileName: string) => {
	// Создаем и настраиваем ссылку для скачивания
	const link = document.createElement('a');
	link.href = url;
	link.download = fileName;
	link.style.display = 'none';

	// Добавляем в DOM, кликаем и удаляем
	document.body.appendChild(link);
	link.click();

	// Небольшая задержка перед удалением для корректной работы
	setTimeout(() => {
		document.body.removeChild(link);
	}, 100);
};
