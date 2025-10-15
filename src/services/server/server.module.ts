import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Server } from '@/models/server.model';
import { ServerRepository } from './server.repository';

@Module({
	imports: [SequelizeModule.forFeature([Server])],
	providers: [ServerRepository],
	exports: [ServerRepository],
})
export class ServerModule {}
