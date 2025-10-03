import fs from 'fs';
import path from 'path';
import { CURRENT_PLUGIN_VERSION } from './CURRENT_PLUGIN_VERSION';

/**
 * Reads event files from the events directory
 * Returns an array of event objects with name and file content
 * @return Array of event definitions
 */
const buildEvents = async (): Promise<
	Array<{ name: string; file: string }>
> => {
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

/**
 * Builds the plugin file by embedding event definitions and configuration
 * Reads the base plugin file and injects dynamic content
 * Returns the complete plugin code as a string
 */
export const buildPlugin = async () => {
	const events = await buildEvents();
	const squadJSPluginRaw = fs
		.readFileSync(path.join(__dirname, './plugins/KOTHPlugin.js'))
		.toString();

	let compiledPlugin = '';
	compiledPlugin += `const EVENTS = ${JSON.stringify(events)}\n\nconst CURRENT_PLUGIN_VERSION=${JSON.stringify(CURRENT_PLUGIN_VERSION)}\n\nconst API_ENDPOINT="http://localhost:3131/"\n\n${squadJSPluginRaw}`;
	return compiledPlugin;
};
