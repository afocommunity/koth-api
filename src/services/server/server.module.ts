import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Server } from '@/models/server.model';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [SequelizeModule.forFeature([Server]), AuthModule],
	controllers: [ServerController],
	providers: [ServerService],
	exports: [ServerService],
})
export class ServerModule {}
