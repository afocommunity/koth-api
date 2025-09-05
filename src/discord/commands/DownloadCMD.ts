import {
	AttachmentBuilder,
	ChatInputCommandInteraction,
	CommandInteraction,
	ContainerBuilder,
	MessageFlags,
	SlashCommandBuilder,
} from 'discord.js';
import { BaseCommand, BaseCommandBuilder } from './BaseCommand';
import { buildPlugin } from '@/squadjs/buildPluginFile';
import { CURRENT_PLUGIN_VERSION } from '@/squadjs/CURRENT_PLUGIN_VERSION';
export default class DownloadCMD extends BaseCommand {
	async executeCommand(_interaction: CommandInteraction) {
		const interaction = _interaction as ChatInputCommandInteraction;
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
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
	build(): BaseCommandBuilder {
		const pluginCommand = new SlashCommandBuilder()
			.setName('download')
			.setDescription('Download the latest version of the KothSync plugin');

		return {
			commands: [pluginCommand],
		};
	}
}
