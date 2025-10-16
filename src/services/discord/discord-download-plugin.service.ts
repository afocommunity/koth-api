import { Injectable, Logger } from '@nestjs/common';
import { KothUIService } from '../koth-ui/koth-ui.service';
import { Client, MessageFlags } from 'discord.js';
import {
	Context,
	ContextOf,
	On,
	Once,
	SlashCommand,
	SlashCommandContext,
} from 'necord';
@Injectable()
export class DiscordDownloadPluginService {
	private readonly logger = new Logger(DiscordDownloadPluginService.name);

	public constructor(
		private readonly client: Client,
		private readonly kothUI: KothUIService,
	) {}

	@Once('clientReady')
	public onReady(@Context() [client]: ContextOf<'clientReady'>) {
		this.logger.log(`Bot logged in as ${client.user.username}`);
	}

	@On('warn')
	public onWarn(@Context() [message]: ContextOf<'warn'>) {
		this.logger.warn(message);
	}

	@SlashCommand({
		name: 'download',
		description: 'Download the latest version of the KothSync plugin',
	})
	public async downloadPluginCmd(
		@Context() [interaction]: SlashCommandContext,
	) {
		await interaction.deferReply({
			// flags: MessageFlags.Ephemeral,
		});

		const { container, file } =
			await this.kothUI.buildPluginDownloadContainer();

		await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
			files: [file],
		});
	}
}
