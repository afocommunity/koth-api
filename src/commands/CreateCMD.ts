import {
	ChatInputCommandInteraction,
	CommandInteraction,
	ContainerBuilder,
	MessageFlags,
	SlashCommandBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';
import { BaseCommand } from './BaseCommand';

export default class CreateCMD extends BaseCommand {
	async executeCommand(_interaction: CommandInteraction) {
		const interaction = _interaction as ChatInputCommandInteraction;
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});
		const container = new ContainerBuilder()
			.setAccentColor(0x0099ff)
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent('What are you creating?'),
			)
			.addActionRowComponents((row) =>
				row.setComponents(
					new StringSelectMenuBuilder()
						.setCustomId('createItem')
						.setOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel('Server')
								.setValue('create-server')
								.setDescription('Register a new Server'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Token')
								.setValue('create-token')
								.setDescription('Register a new Token for your Server'),
							new StringSelectMenuOptionBuilder()
								.setLabel('Org')
								.setValue('create-org')
								.setDescription('Staff Command'),
						),
				),
			);
		await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
		});
	}
	build() {
		const createCommand = new SlashCommandBuilder()
			.setName('create')
			.setDescription('placeholder');

		return { commands: [createCommand] };
	}
}
