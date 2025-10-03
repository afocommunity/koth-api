import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { PluginFileModule } from './plugin-file/plugin-file.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ApiToken } from './models/ApiToken.model';
import { FormState } from './models/FormState.model';
import { LoadoutItem } from './models/LoadoutItem.model';
import { PermaUnlocks } from './models/PermaUnlocks.model';
import { Player } from './models/Player.model';
import { PlayerSave } from './models/PlayerSave.model';
import { WeaponXP } from './models/WeaponXP.model';
@Module({
	imports: [
		ConfigModule.forRoot(),
		SequelizeModule.forRoot({
			database: process.env.DB_DATABASE,
			dialect: process.env.DB_DIALECT as 'mysql' | 'mariadb' | 'postgres',
			host: process.env.DB_HOST,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT != null ? Number(process.env.DB_PORT) : null,
			username: process.env.DB_USER,
			models: [
				ApiToken,
				FormState,
				LoadoutItem,
				PermaUnlocks,
				Player,
				PlayerSave,
				WeaponXP,
			],
		}),
		PlayerModule,
		PluginFileModule,
	],
})
export class AppModule {}
