import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
// import { AuthController } from './';

@Module({
	imports: [
		JwtModule.register({
			secret: process.env.AUTH_SECRET,
			global: true,
			signOptions: {},
		}),
	],
  providers: [AuthService],
  exports: [AuthService],
  // controllers: [AuthController]
})
export class AuthModule {}
