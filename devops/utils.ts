import fs from 'node:fs';
import path from 'node:path';

export const writeFile = (fileName: string, data: Record<string, string>) => {
	fs.writeFileSync(path.join('.sst', fileName), JSON.stringify(data, null, 2));
};

export const readFile = (fileName: string): Record<string, string> => {
	try {
		const file = fs.readFileSync(path.join('.sst', fileName), 'utf8');
		if (!file) return {};
		return JSON.parse(file);
	} catch (_) {
		return {};
	}
};
