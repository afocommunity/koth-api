import { Module } from '@nestjs/common';
import { DataStreamGateway } from './data-stream.gateway';
import { AuthModule } from '../auth/auth.module';
import { PlayerSyncService } from '../player-sync/player-sync.service';
import { PlayerSyncModule } from '../player-sync/player-sync.module';
@Module({
	providers: [DataStreamGateway, PlayerSyncService],
	imports: [AuthModule, PlayerSyncModule],
})
export class DataStreamModule {}
