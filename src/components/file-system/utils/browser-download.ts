export const download = (url: string, filename: string): void => {
	const element = document.createElement('a');
	element.setAttribute('href', url);
	element.setAttribute('download', filename);
	element.setAttribute('target', '__blank');

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}