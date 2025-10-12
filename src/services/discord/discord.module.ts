import { Module } from '@nestjs/common';
import { DiscordDownloadPluginService } from './discord-download-plugin.service';

@Module({
	providers: [DiscordDownloadPluginService],
})
export class DiscordModule {}
