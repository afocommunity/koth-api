import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Server } from '@/models/server.model';
import { ServerService } from './server.service';

@Module({
	imports: [SequelizeModule.forFeature([Server])],
	providers: [ServerService],
	exports: [ServerService],
})
export class ServerModule {}
