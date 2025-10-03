import { Module } from '@nestjs/common';
import { PlayerController } from './player.controller';
import { Player } from './player.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayerService } from './player.service';

@Module({
	controllers: [PlayerController],
	providers: [PlayerService],
	imports: [SequelizeModule.forFeature([Player])],
	exports: [SequelizeModule],
})
export class PlayerModule {}
