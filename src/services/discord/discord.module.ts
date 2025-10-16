import { Module } from '@nestjs/common';
import { DiscordDownloadPluginService } from './discord-download-plugin.service';
import { KothUIModule } from '../koth-ui/koth-ui.module';
import { DiscordCreateService } from './discord-create.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FormState } from '@/models/form-state.model';

@Module({
	imports: [KothUIModule, SequelizeModule.forFeature([FormState])],
	providers: [DiscordDownloadPluginService, DiscordCreateService],
})
export class DiscordModule {}
