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

type NewOrgFormState = {
	orgName?: string;
	orgInvite?: string;
	owner?: string;
	admins?: string[];
};
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

	public buildCreateNewOrgWindow(formState: NewOrgFormState) {
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
								.setLabel('Input Value')
								.setValue('set-name'),
							new StringSelectMenuOptionBuilder()
								.setLabel(
									'Input Value - Duplicate because the selector can break',
								)
								.setValue('set-name-2'),
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
								.setLabel('Input Value')
								.setValue('set-invite'),
							new StringSelectMenuOptionBuilder()
								.setLabel(
									'Input Value - Duplicate because the selector can break',
								)
								.setValue('set-invite-2'),
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
		const isReady =
			formState.orgName != null &&
			formState.owner != null &&
			formState.orgInvite != null;
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

	/**
	 * Builds a modal for setting the organization name
	 */
	public buildCreateNewOrgNameModal(currentName?: string) {
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

	/**
	 * Builds a modal for setting the organization Discord invite link
	 */
	public buildCreateNewOrgInviteModal(currentInvite?: string) {
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

	/**
	 * Builds a container for the initial "What are you creating?" prompt
	 */
	public buildCreateWhatForm(enableOrg: boolean = true) {
		const container = new ContainerBuilder()
			.setAccentColor(0x0099ff)
			.addTextDisplayComponents((textDisplay) =>
				textDisplay.setContent('What are you creating?'),
			)
			.addActionRowComponents((row) => {
				row.setComponents(
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setLabel('Create Token')
						.setCustomId('createToken'),
					new ButtonBuilder()
						.setStyle(ButtonStyle.Primary)
						.setLabel('Create Server')
						.setCustomId('createServer'),
				);
				if (enableOrg)
					row.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setLabel('Create Org')
							.setCustomId('createOrg'),
					);
				return row;
			});
		return container;
	}
}
