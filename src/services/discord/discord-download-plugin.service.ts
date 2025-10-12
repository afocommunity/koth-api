import { Injectable, Logger } from '@nestjs/common';
import {
	AttachmentBuilder,
	Client,
	ContainerBuilder,
	MessageFlags,
} from 'discord.js';
import {
	Context,
	ContextOf,
	On,
	Once,
	SlashCommand,
	SlashCommandContext,
} from 'necord';
import { CURRENT_PLUGIN_VERSION } from '../plugin-file/squadjs/CURRENT_PLUGIN_VERSION';
import { buildPlugin } from '../plugin-file/squadjs/buildPluginFile';

@Injectable()
export class DiscordDownloadPluginService {
	private readonly logger = new Logger(DiscordDownloadPluginService.name);

	public constructor(private readonly client: Client) {}

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
	public async downloadPlugin(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply({
			// flags: MessageFlags.Ephemeral,
		});
		const container = new ContainerBuilder()
			.setAccentColor(0x0099ff)
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					`# KOTH SquadJS Plugin\nDownload the latest version of the plugin below\n**Version:** ${CURRENT_PLUGIN_VERSION}`,
				),
			)
			.addSeparatorComponents((sp) => sp.setDivider(true))
			.addFileComponents((file) => file.setURL('attachment://KOTHPlugin.js'))
			.addSeparatorComponents((sp) => sp.setDivider(true))
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					'## Instructions\n- 1. Place `KOTHPlugin.js` in your SquadJS Plugins folder (Located in `/squad-server/plugins`)\n- 2. Set up the Config.json with your access token (</create:1387267086627115129>)\n- 3. Restart SquadJS\n- 4. Follow any onscreen instructions. You might need to restart again if there are event hooks that need set up.',
				),
			);
		const file = new AttachmentBuilder(Buffer.from(await buildPlugin()))
			.setName('KOTHPlugin.js')
			.setDescription('KOTH Plugin');
		await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
			files: [file],
		});
	}
}
