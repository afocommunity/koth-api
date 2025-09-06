import {
	ActionRowBuilder,
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

type NewOrgFormState = {
	orgName?: string;
	orgInvite?: string;
	owner?: string;
	admins?: string[];
};
export class KothUI {
	public static createNewOrgWindow(formState: NewOrgFormState) {
		const container = new ContainerBuilder().setAccentColor(0x0099ff);
		container.addTextDisplayComponents((textDisplay) =>
			textDisplay.setContent(`# New Organization\n## Name`),
		);
		if (formState.orgName) {
			container.addActionRowComponents((ar) =>
				ar.setComponents(
					new StringSelectMenuBuilder()
						.setCustomId('newOrgName')
						.setPlaceholder('Set Name')
						.setOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel(formState.orgName)
								.setValue('null')
								.setDefault(true),
							new StringSelectMenuOptionBuilder()
								.setLabel('Change Name')
								.setValue('set-name'),
						),
				),
			);
		} else {
			container.addActionRowComponents((ar) =>
				ar.setComponents(
					new StringSelectMenuBuilder()
						.setCustomId('newOrgName')
						.setPlaceholder('Set Name')
						.setOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel('Set Name')
								.setValue('set-name'),
						),
				),
			);
		}
		container.addTextDisplayComponents((textDisplay) =>
			textDisplay.setContent(`## Invite Link`),
		);

		if (formState.orgInvite) {
			container.addActionRowComponents((ar) =>
				ar.setComponents(
					new StringSelectMenuBuilder()
						.setCustomId('newOrgInvite')
						.setPlaceholder('Set Discord Invite')
						.setOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel(formState.orgInvite)
								.setValue('null')
								.setDefault(true),
							new StringSelectMenuOptionBuilder()
								.setLabel('Change Discord Invite')
								.setValue('set-invite'),
						),
				),
			);
		} else {
			container.addActionRowComponents((ar) =>
				ar.setComponents(
					new StringSelectMenuBuilder()
						.setCustomId('newOrgInvite')
						.setPlaceholder('Set Discord Invite')
						.setOptions(
							new StringSelectMenuOptionBuilder()
								.setLabel('Set Discord Invite')
								.setValue('set-invite'),
						),
				),
			);
		}
		container.addTextDisplayComponents((textDisplay) =>
			textDisplay.setContent(`## Owner`),
		);
		if (formState.owner) {
			container.addActionRowComponents((ar) =>
				ar.setComponents(
					new UserSelectMenuBuilder()
						.setCustomId('newOrgOwner')
						.setDefaultUsers(formState.owner),
				),
			);
		} else {
			container.addActionRowComponents((ar) =>
				ar.setComponents(
					new UserSelectMenuBuilder()
						.setCustomId('newOrgOwner')
						.setPlaceholder('Set Owner'),
				),
			);
		}
		container.addTextDisplayComponents((td) =>
			td.setContent('## Administrators\n-# These users have a Lot of power.'),
		);
		if (formState.admins) {
			container.addActionRowComponents((ar) =>
				ar.addComponents(
					new UserSelectMenuBuilder()
						.setCustomId('newOrgAdmins')
						.setMaxValues(8)
						.setDefaultUsers(formState.admins),
				),
			);
		} else {
			container.addActionRowComponents((ar) =>
				ar.addComponents(
					new UserSelectMenuBuilder()
						.setCustomId('newOrgAdmins')
						.setPlaceholder('Set Admins')
						.setMaxValues(8),
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
	public static createNewOrgNameModal(currentName?: string) {
		const modal = new ModalBuilder();
		const input = new TextInputBuilder()
			.setCustomId('newOrgName')
			.setPlaceholder('My Awesome Community')
			.setStyle(TextInputStyle.Short)
			.setLabel('Org Name')
			.setRequired(true);
		if (currentName) input.setValue(currentName);
		modal
			.setCustomId('newOrgName')
			.setTitle('Set Name')
			.setComponents(
				new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
					input,
				),
			);
		return modal;
	}
	public static createNewOrgInviteModal(currentInvite?: string) {
		const modal = new ModalBuilder();
		const input = new TextInputBuilder()
			.setCustomId('newOrgInvite')
			.setPlaceholder('https://discord.gg/kingofthehill')
			.setStyle(TextInputStyle.Short)
			.setLabel('Org Discord Invite URL')
			.setRequired(true);

		if (currentInvite) input.setValue(currentInvite);
		modal
			.setCustomId('newOrgInvite')
			.setTitle('Set Invite')
			.setComponents(
				new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
					input,
				),
			);
		return modal;
	}
}
