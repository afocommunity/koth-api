import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ApiToken } from '@/models/api-token.model';
// import { AuthController } from './';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.AUTH_SECRET,
			global: true,
			signOptions: {},
		}),
		SequelizeModule.forFeature([ApiToken]),
	],
	providers: [AuthService],
	exports: [AuthService, SequelizeModule],
	// controllers: [AuthController]
})
export class AuthModule {}
