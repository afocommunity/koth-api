import { Controller, Get, Header } from '@nestjs/common';
import { buildPlugin } from './squadjs/buildPluginFile';
import { CURRENT_PLUGIN_VERSION } from './squadjs/CURRENT_PLUGIN_VERSION';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('plugin-file')
export class PluginFileController {
	@ApiOperation({ summary: 'Get the latest plugin file' })
	@ApiOkResponse({ description: 'Latest plugin file' })
	@Get('/download')
	@Header('content-type', 'text/javascript')
	public async getPlugin() {
		return buildPlugin();
	}

	@ApiOperation({ summary: 'Get the latest plugin version' })
	@ApiOkResponse({ description: 'Latest plugin version' })
	@Get('/version')
	public async getPluginVersion() {
		return CURRENT_PLUGIN_VERSION;
	}
}
