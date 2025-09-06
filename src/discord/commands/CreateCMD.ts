import {
	AnySelectMenuInteraction,
	ChatInputCommandInteraction,
	CommandInteraction,
	ContainerBuilder,
	MessageFlags,
	SlashCommandBuilder,
	ModalSubmitInteraction,
	ButtonInteraction,
	ComponentType,
	UserSelectMenuInteraction,
	TextDisplayBuilder,
} from 'discord.js';
import { BaseCommand, BaseCommandBuilder } from './BaseCommand';
import { FormState } from '@/models/FormState.model';
import { createId } from '@/utils/createId';
import { KothUI } from '../KothUI';

const systemAdmins = new Set<string>();

const adminEnv = process.env.ADMINS;

for (const admin of adminEnv.split(',')) {
	if (admin.trim() === '') continue;
	systemAdmins.add(admin.trim());
}

export default class CreateCMD extends BaseCommand {
	async executeCommand(_interaction: CommandInteraction) {
		const interaction = _interaction as ChatInputCommandInteraction;
		await interaction.deferReply({
			// flags: MessageFlags.Ephemeral,
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
		const container = KothUI.buildCreateWhatForm(
			systemAdmins.has(interaction.user.id),
		);
		await formState.save();
		await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
		});
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
				const response = await interaction.deferUpdate({
					// flags: MessageFlags.Ephemeral,
				});
				if (!systemAdmins.has(interaction.user.id)) {
					response.edit({
						components: [
							new TextDisplayBuilder().setContent(
								'You do not have permission to run this action',
							),
						],
						flags: [MessageFlags.IsComponentsV2],
					});
					return
				}
				formState.type = 'createOrg';
				formState.data = JSON.stringify({});
				await formState.save();
				response.edit({
					components: [
						KothUI.buildCreateNewOrgWindow(JSON.parse(formState.data)),
					],
					flags: [MessageFlags.IsComponentsV2],
				});
				break;
			}
			case 'finalizeOrgCreation': {
				break;
			}
			case 'cancelOrgCreation': {
				const response = await interaction.deferUpdate({
					// flags: MessageFlags.Ephemeral,
				});
				formState.type = 'createItem';
				formState.data = JSON.stringify({});
				await formState.save();
				response.edit({
					components: [
						KothUI.buildCreateWhatForm(systemAdmins.has(interaction.user.id)),
					],
					flags: [MessageFlags.IsComponentsV2],
				});
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
			// flags: MessageFlags.Ephemeral,
		});
		const container = KothUI.buildCreateNewOrgWindow(formData);

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
				container = KothUI.buildCreateNewOrgWindow(formData);
				formState.data = JSON.stringify(formData);
				break;
			}
			case 'newOrgAdmins': {
				const i = interaction as UserSelectMenuInteraction;
				const formData = JSON.parse(formState.data);
				const users = i.users;
				formData.admins = users.map((u) => u.id);
				container = KothUI.buildCreateNewOrgWindow(formData);
				formState.data = JSON.stringify(formData);
				break;
			}
			case 'newOrgInvite': {
				const formData = JSON.parse(formState.data);
				await interaction.showModal(
					KothUI.buildCreateNewOrgInviteModal(formData.orgInvite),
				);
				try {
					const r = await interaction.awaitModalSubmit({
						filter: (i) =>
							i.message.id == formState.message_id &&
							i.customId == 'newOrgInvite',
						time: 480_000,
					});
					const c = await r.deferUpdate();
					const newInvite = r.fields.getField('newOrgInvite').value;
					formData.orgInvite = newInvite;
					formState.data = JSON.stringify(formData);
					await formState.save();
					c.edit({
						components: [KothUI.buildCreateNewOrgWindow(formData)],
						flags: [MessageFlags.IsComponentsV2],
					});
				} catch (_) {
					container = KothUI.buildCreateNewOrgWindow(formData);
					await interaction.update({
						components: [container],
						flags: [MessageFlags.IsComponentsV2],
					});
				}
				return;
			}
			case 'newOrgName': {
				const formData = JSON.parse(formState.data);
				await interaction.showModal(
					KothUI.buildCreateNewOrgNameModal(formData.orgName),
				);
				try {
					const r = await interaction.awaitModalSubmit({
						filter: (i) =>
							i.message.id == formState.message_id &&
							i.customId == 'newOrgName',
						time: 480_000,
					});
					const c = await r.deferUpdate();
					const newName = r.fields.getField('newOrgName').value;
					formData.orgName = newName;
					formState.data = JSON.stringify(formData);
					await formState.save();
					c.edit({
						components: [KothUI.buildCreateNewOrgWindow(formData)],
						flags: [MessageFlags.IsComponentsV2],
					});
				} catch (_) {
					container = KothUI.buildCreateNewOrgWindow(formData);
					await interaction.update({
						components: [container],
						flags: [MessageFlags.IsComponentsV2],
					});
				}
				return;
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
			buttons: [
				'createToken',
				'createOrg',
				'finalizeOrgCreation',
				'cancelOrgCreation',
			],
			select: [
				'createItem',
				'newOrgOwner',
				'newOrgAdmins',
				'newOrgName',
				'newOrgInvite',
			],
			modals: ['createOrg'],
		};
	}
}
