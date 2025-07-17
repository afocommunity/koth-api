import fs from 'fs';
import path from 'path';
import { CURRENT_VERSION } from './CURRENT_VERSION';

const buildEvents = async () => {
	const events: Array<{ name: string; file: string }> = [];
	const files = await fs.promises.opendir(path.join(__dirname, './events'));
	for await (const file of files) {
		if (!file.isFile() || !file.name.endsWith('.js')) continue;
		const rawFile = fs
			.readFileSync(path.join(file.parentPath, file.name))
			.toString()
			.replaceAll('\n', '');
		events.push({ name: file.name, file: rawFile });
	}
	return events;
};

export const buildPlugin = async () => {
	const events = await buildEvents();
	const squadJSPluginRaw = fs
		.readFileSync(path.join(__dirname, './plugins/KOTHPlugin.js'))
		.toString();

	let compiledPlugin = '';
	compiledPlugin += `const EVENTS = ${JSON.stringify(events)}\n\nconst CURRENT_VERSION=${JSON.stringify(CURRENT_VERSION)}\n\nconst API_ENDPOINT="http://localhost:3030/"\n\n${squadJSPluginRaw}`;
	return compiledPlugin;
};
