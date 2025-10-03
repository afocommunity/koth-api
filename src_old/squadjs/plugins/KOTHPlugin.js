/* eslint-disable no-undef */
/**
 * Properties injected on kApi Build:
 *
 * EVENTS
 * { name: string, file: string }
 *
 * CURRENT_PLUGIN_VERSION
 * string
 *
 * API_ENDPOINT
 * string
 */

import BasePlugin from './base-plugin.js';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginFilePath = path.join(__dirname, 'KOTHPlugin.js');
const eventsFolderPath = path.join(__dirname, '..', 'log-parser');
export default class KOTHPlugin extends BasePlugin {
	static get description() {
		return 'Enable Shared Economy';
	}

	static get defaultEnabled() {
		return true;
	}

	static get optionsSpecification() {
		return {
			apiToken: {
				required: true,
				description: 'KOTH Api Token',
				default: 'YOUR_ACCESS_TOKEN',
			},
			apiEndpoint: {
				required: false,
				description:
					'KOTH Api Endpoint (If you want to have your own private or local economy)',
				default: null,
			},
		};
	}

	constructor(server, options, connectors) {
		super(server, options, connectors);
		this.host = options.apiEndpoint ?? API_ENDPOINT;
	}

	/**
	 * Constructs headers for API requests including authorization
	 */
	getHeaders() {
		return {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${this.options.apiToken}`,
		};
	}

	/**
	 * Compares two semantic version strings
	 * @param {string} version1 - First version string (e.g., "v1.2.3")
	 * @param {string} version2 - Second version string (e.g., "v1.2.4")
	 * @return {number} 1 if version1 > version2, -1 if version1 < version2, 0 if equal
	 */
	async compareVersions(version1, version2) {
		const v1Parts = version1.replace('v', '').split('.').map(Number);
		const v2Parts = version2.replace('v', '').split('.').map(Number);

		for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
			const v1 = v1Parts[i] || 0;
			const v2 = v2Parts[i] || 0;

			if (v1 > v2) return 1;
			if (v1 < v2) return -1;
		}

		return 0;
	}

	/**
	 * Checks for plugin updates by querying the API endpoint
	 */
	async checkForUpdates() {
		const versionEndpoint = API_ENDPOINT + 'plugin/version';
		const vResponse = await axios({
			url: versionEndpoint,
			method: 'GET',
			headers: this.getHeaders(),
		});
		if (vResponse.status != 200) {
			this.verbose(1, 'Unable to check latest version');
			return;
		}
		const comparisonResult = await this.compareVersions(
			CURRENT_PLUGIN_VERSION,
			vResponse.data.data,
		);
		return comparisonResult;
	}

	/**
	 * Removes existing event files from the log-parser directory
	 */
	clearEvents() {
		for (const event of EVENTS) {
			const eventFilePath = path.join(eventsFolderPath, event.name);
			fs.rmSync(eventFilePath, { force: true });
		}
	}

	/**
	 * Creates event files in the log-parser directory if they do not exist
	 * Writes the event file content from the EVENTS array
	 * Prompts for a restart after creating events
	 */
	createEvents() {
		this.clearEvents();
		for (const event of EVENTS) {
			const eventFilePath = path.join(eventsFolderPath, event.name);
			fs.writeFileSync(eventFilePath, event.file);
		}
		this.verbose(1, chalk.red('Events Created. Please restart SquadJS.'));
	}

	checkEvents() {
		let pass = true;
		for (const event of EVENTS) {
			const eventFilePath = path.join(eventsFolderPath, event.name);
			if (!fs.existsSync(eventFilePath)) pass = false;
		}
		return pass;
	}

	/**
	 * Updates the plugin by downloading the latest version from the API endpoint
	 * Writes the new version to the plugin file path
	 * Clears existing events and prompts for a restart
	 */
	async update() {
		const downloadEndpoint = API_ENDPOINT + 'plugin/download';
		const response = await axios({
			url: downloadEndpoint,
			method: 'GET',
			headers: this.getHeaders(),
		});
		if (response.status != 200) {
			this.verbose(1, chalk.red('Unable to download latest version'));
			return;
		}
		this.clearEvents();

		fs.writeFileSync(pluginFilePath, response.data.data);
		this.verbose(1, chalk.red('Plugin Updated. Please restart SquadJS.'));
	}

	async mount() {
		if (!this.checkEvents()) this.createEvents();
		//? Mounting Logic

		//? Update Logic
		const updates = await this.checkForUpdates();
		if (updates == 0) {
			// Up to Date
			this.verbose(
				1,
				chalk.green(`Plugin up-to-date. ${CURRENT_PLUGIN_VERSION}`),
			);
		} else if (updates > 0) {
			// Pre-Release
		} else if (updates < 0) {
			//Update
			return await this.update();
		}
	}

	async unmount() {
		this.verbose(1, 'Unmount');
	}
}
