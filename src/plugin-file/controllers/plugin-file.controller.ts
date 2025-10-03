import { Controller, Get } from '@nestjs/common';
import { buildPlugin } from '../squadjs/buildPluginFile';
import { CURRENT_PLUGIN_VERSION } from '../squadjs/CURRENT_PLUGIN_VERSION';

@Controller('plugin-file')
export class PluginFileController {
	@Get('/download')
	public async getPlugin() {
		return buildPlugin();
	}
	@Get('/version')
	public async getPluginVersion() {
		return CURRENT_PLUGIN_VERSION;
	}
}
