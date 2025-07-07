import {
	AnySelectMenuInteraction,
	ChatInputCommandInteraction,
	CommandInteraction,
	ContainerBuilder,
	MessageFlags,
	SlashCommandBuilder,
	spoiler,
	bold,
	codeBlock,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
} from 'discord.js';
import { BaseCommand, BaseCommandBuilder } from './BaseCommand';
import { AuthController } from '@/controllers/AuthController';

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
	public async executeSelect(interaction: AnySelectMenuInteraction) {
		const container = new ContainerBuilder().setAccentColor(0x0099ff);
		if (interaction.values[0] === 'create-token') {
			const tokens = await AuthController.createApiToken('0', '0', '14h');
			container
				.addTextDisplayComponents((textDisplay) =>
					textDisplay.setContent(
						`Token Created. ${bold('This will not be recoverable if you lose this')}`,
					),
				)
				.addTextDisplayComponents((td) =>
					td.setContent(spoiler(codeBlock(tokens.token))),
				);
		} else {
			container
				.addTextDisplayComponents((textDisplay) =>
					textDisplay.setContent('You selected:'),
				)
				.addTextDisplayComponents((textDisplay) =>
					textDisplay.setContent(interaction.values[0]),
				);
		}
		await interaction.update({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
		});
	}
	build(): BaseCommandBuilder {
		const createCommand = new SlashCommandBuilder()
			.setName('create')
			.setDescription('placeholder');

		return {
			commands: [createCommand],
			select: ['createItem'],
		};
	}
}
