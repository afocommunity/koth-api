import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayerSyncController } from './player-sync.controller';
import { PlayerSyncService } from './player-sync.service';
import { Player } from '../player/player.model';
import { PlayerSave } from '@/models/player-save.model';
import { LoadoutItem } from '@/models/loudout-item.model';
import { WeaponXP } from '@/models/weapon-xp.model';
import { PermaUnlocks } from '@/models/perma-unlock.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		SequelizeModule.forFeature([
			Player,
			PlayerSave,
			LoadoutItem,
			WeaponXP,
			PermaUnlocks,
		]),
		AuthModule,
	],
	controllers: [PlayerSyncController],
	providers: [PlayerSyncService],
	exports: [PlayerSyncService],
})
export class PlayerSyncModule {}
