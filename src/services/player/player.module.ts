import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { Player } from './player.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayerService } from './player.service';
import { LoadoutItem } from '@/models/loudout-item.model';
import { PermaUnlocks } from '@/models/perma-unlock.model';
import { PlayerSave } from '@/models/player-save.model';
import { WeaponXP } from '@/models/weapon-xp.model';

@Module({
	controllers: [PlayerController],
	providers: [PlayerService],
	imports: [
		SequelizeModule.forFeature([
			Player,
			LoadoutItem,
			PermaUnlocks,
			PlayerSave,
			WeaponXP,
		]),
	],
	exports: [SequelizeModule],
})
export class PlayerModule {}
