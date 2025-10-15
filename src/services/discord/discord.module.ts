import { Module } from '@nestjs/common';
import { DiscordDownloadPluginService } from './discord-download-plugin.service';
import { KothUIModule } from '../koth-ui/koth-ui.module';

@Module({
	imports: [KothUIModule],
	providers: [DiscordDownloadPluginService],
})
export class DiscordModule {}
