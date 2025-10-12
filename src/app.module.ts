import { NecordModule } from 'necord';
import { Module } from '@nestjs/common';
import { PlayerModule } from './services/player/player.module';
import { PlayerSyncModule } from './services/player-sync/player-sync.module';
import { PluginFileModule } from './services/plugin-file/plugin-file.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ApiToken } from './models/api-token.model';
import { FormState } from './models/form-state.model';
import { LoadoutItem } from './models/loudout-item.model';
import { PermaUnlocks } from './models/perma-unlock.model';
import { Player } from './services/player/player.model';
import { PlayerSave } from './models/player-save.model';
import { WeaponXP } from './models/weapon-xp.model';
import { AuthModule } from './services/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DataStreamModule } from './services/data-stream/data-stream.module';
import {
	ActivityType,
	GatewayIntentBits,
	PresenceUpdateStatus,
} from 'discord.js';
import { DiscordModule } from './services/discord/discord.module';
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
		ScheduleModule.forRoot(),
		NecordModule.forRoot({
			token: process.env.DISCORD_TOKEN,
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
			development: [process.env.DISCORD_DEVELOPMENT_GUILD_ID],
			presence: {
				status: PresenceUpdateStatus.Online,
				activities: [
					{
						name: 'King of the Hill',
						type: ActivityType.Custom,
						url: 'https://discord.gg/kingofthehill',
						state: 'Capturing the Point',
					},
				],
			},
		}),
		DiscordModule,
		AuthModule,
		DataStreamModule,
		PlayerModule,
		PlayerSyncModule,
		PluginFileModule,
	],
})
export class AppModule {}
