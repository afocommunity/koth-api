import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { PluginFileModule } from './plugin-file/plugin-file.module';

@Module({
	imports: [PlayerModule, PluginFileModule],
})
export class AppModule {}
