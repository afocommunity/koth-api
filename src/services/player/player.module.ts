import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { Player } from './player.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayerService } from './player.service';
import { PlayerSave } from '@/models/player-save.model';
import { LoadoutItem } from '@/models/loudout-item.model';
import { WeaponXP } from '@/models/weapon-xp.model';
import { PermaUnlocks } from '@/models/perma-unlock.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	controllers: [PlayerController],
	providers: [PlayerService],
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
	exports: [SequelizeModule],
})
export class PlayerModule {}
