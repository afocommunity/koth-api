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
	ModalSubmitInteraction,
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
	ModalActionRowComponentBuilder,
	ButtonBuilder,
	ButtonStyle,
	ButtonInteraction,
	ComponentType,
	UserSelectMenuBuilder,
	UserSelectMenuInteraction,
} from 'discord.js';
import { BaseCommand, BaseCommandBuilder } from './BaseCommand';
import { AuthController } from '@/controllers/AuthController';
import { FormState } from '@/models/FormState.model';
import { createId } from '@/utils/createId';

export default class CreateCMD extends BaseCommand {
	async executeCommand(_interaction: CommandInteraction) {
		const interaction = _interaction as ChatInputCommandInteraction;
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});
		const msg = await interaction.fetchReply();
		let formState = await FormState.findOne({
			where: { message_id: msg.id },
		});
		if (formState == null) {
			formState = new FormState({
				id: createId(),
				message_id: msg.id,
				user_id: interaction.user.id,
				type: 'createItem',
			});
			formState.data = JSON.stringify({});
		}
		const container = new ContainerBuilder()
			.setAccentColor(0x0099ff)
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent('What are you creating?'),
			)
			.addActionRowComponents((row) =>
				row.setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setLabel('Create Token')
						.setCustomId('createToken'),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setLabel('Create Server')
						.setCustomId('createServer'),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Secondary)
						.setLabel('Create Org')
						.setCustomId('createOrg'),
				),
			);
		await formState.save();
		await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
		});
	}
	public async createNewOrgWindow(formState) {
		const container = new ContainerBuilder()
			.setAccentColor(0x0099ff)
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent(
					`# Create New Organization\n\n## Name\n\`${formState.orgName ?? 'No Name????'}\`\n## Owner`,
				),
			);
		if (formState.owner) {
			container.addActionRowComponents((ar) =>
				ar.addComponents(
					new UserSelectMenuBuilder()
						.setCustomId('newOrgOwner')
						.setPlaceholder('Org Owner')
						.setDefaultUsers(formState.owner),
				),
			);
			// container.addTextDisplayComponents((textDisplay) =>
			// 	textDisplay.setContent(
			// 		`Owner: <@${formState.owner}> (${formState.owner_name})`,
			// 	),
			// );
		} else {
			container.addActionRowComponents((ar) =>
				ar.addComponents(
					new UserSelectMenuBuilder()
						.setCustomId('newOrgOwner')
						.setPlaceholder('Org Owner'),
				),
			);
		}
		const isReady = formState.orgName != null && formState.owner != null;
		container
			.addSeparatorComponents((sp) => sp.setDivider(true))
			.addActionRowComponents((ar) =>
				ar.addComponents(
					new ButtonBuilder()
						.setLabel('Create New Org')
						.setStyle(ButtonStyle.Success)
						.setDisabled(!isReady)
						.setCustomId('finalizeOrgCreation'),
					// .setEmoji('✅'),
					new ButtonBuilder()
						.setLabel('Cancel')
						.setStyle(ButtonStyle.Danger)
						.setCustomId('cancelOrgCreation'),
					// .setEmoji('❌'),
				),
			);
		return container;
	}
	public async executeButton(interaction: ButtonInteraction) {
		const formState = await FormState.findOne({
			where: { message_id: interaction.message.id },
		});
		if (formState == null) {
			await interaction.update({
				components: [
					new ContainerBuilder().addTextDisplayComponents((ts) =>
						ts.setContent('Form Expired. Please run the commands again.'),
					),
				],
				flags: [MessageFlags.IsComponentsV2],
			});
			return;
		}
		switch (interaction.customId) {
			case 'createOrg': {
				formState.type = 'createOrg';
				const modal = new ModalBuilder()
					.setTitle('Create Organization')
					.setCustomId('createOrg')
					.addComponents(
						new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
							new TextInputBuilder()
								.setCustomId('orgName')
								.setLabel('Organization Name')
								.setStyle(TextInputStyle.Short),
						),
					);
				interaction.showModal(modal, { withResponse: true });
				break;
			}
		}
	}
	public async executeModal(interaction: ModalSubmitInteraction) {
		const formState = await FormState.findOne({
			where: { message_id: interaction.message.id },
		});

		if (formState == null) {
			await interaction.reply({
				components: [
					new ContainerBuilder().addTextDisplayComponents((ts) =>
						ts.setContent('Form Expired. Please run the commands again.'),
					),
				],
				flags: [MessageFlags.IsComponentsV2],
			});
			return;
		}
		const formData = JSON.parse(formState.data);
		formData.orgName = interaction.fields.getField(
			'orgName',
			ComponentType.TextInput,
		).value;
		await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});
		const container = await this.createNewOrgWindow(formData);

		// formState.message_id = msg.id;
		//await formState.save();
		const newMsg = await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
		});
		formState.data = JSON.stringify(formData);
		formState.message_id = newMsg.id;
		await formState.save();
	}
	public async executeSelect(interaction: AnySelectMenuInteraction) {
		const formState = await FormState.findOne({
			where: { message_id: interaction.message.id },
		});

		if (formState == null) {
			await interaction.update({
				components: [
					new ContainerBuilder().addTextDisplayComponents((ts) =>
						ts.setContent('Form Expired. Please run the commands again.'),
					),
				],
				flags: [MessageFlags.IsComponentsV2],
			});
			return;
		}
		let container = new ContainerBuilder().setAccentColor(0x0099ff);
		switch (interaction.customId) {
			case 'newOrgOwner': {
				const i = interaction as UserSelectMenuInteraction;
				const formData = JSON.parse(formState.data);
				const user = i.users.at(0);
				formData.owner = user.id;
				formData.owner_name = user.username;
				container = await this.createNewOrgWindow(formData);
				formState.data = JSON.stringify(formData);
				break;
			}
		}
		await formState.save();
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
			buttons: ['createToken', 'createOrg'],
			select: ['createItem', 'newOrgOwner'],
			modals: ['createOrg'],
		};
	}
}
