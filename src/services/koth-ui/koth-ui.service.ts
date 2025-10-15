import { Injectable } from '@nestjs/common';
import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	ContainerBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	TextInputBuilder,
	TextInputStyle,
	UserSelectMenuBuilder,
} from 'discord.js';
import { buildPlugin } from '../plugin-file/squadjs/buildPluginFile';
import { CURRENT_PLUGIN_VERSION } from '../plugin-file/squadjs/CURRENT_PLUGIN_VERSION';

@Injectable()
export class KothUIService {
	public async buildPluginDownloadContainer() {
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
		return { container, file };
	}
}
