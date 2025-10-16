import { Injectable, Logger } from '@nestjs/common';
import { ButtonInteraction, Client, MessageFlags } from 'discord.js';
import { KothUIService } from '../koth-ui/koth-ui.service';
import {
	Button,
	ButtonContext,
	Context,
	Modal,
	ModalContext,
	SlashCommand,
	SlashCommandContext,
} from 'necord';
import { InjectModel } from '@nestjs/sequelize';
import { FormState } from '@/models/form-state.model';
import { createId } from '@/utils/createId';
@Injectable()
export class DiscordCreateService {
	private readonly logger = new Logger(DiscordCreateService.name);

	public constructor(
		private readonly client: Client,
		private readonly kothUI: KothUIService,
		@InjectModel(FormState) private readonly formState: typeof FormState,
	) {}

	private async getButtonFormState(
		interaction: ButtonInteraction,
	): Promise<FormState | null> {
		const formState = await FormState.findOne({
			where: { message_id: interaction?.message?.id },
		});
		return formState;
	}

	@SlashCommand({
		name: 'create',
		description: 'Create an Organization, Server, or API Token',
	})
	public async createEntryCmd(@Context() [interaction]: SlashCommandContext) {
		await interaction.deferReply({
			// flags: MessageFlags.Ephemeral,
		});
		const msg = await interaction.fetchReply();
		let formState = await this.formState.findOne({
			where: { message_id: msg?.id },
		});
		formState ??= new this.formState({
			id: createId(),
			message_id: msg.id,
			user_id: interaction.user.id,
			type: 'createItem',
		});
		formState.data ??= JSON.stringify({});

		const systemAdmins = new Set(
			process.env.ADMINS?.split(',')?.map((a) => a.trim()) ?? [],
		);
		const { container } = this.kothUI.buildCreateWhatForm(
			systemAdmins.has(interaction.user.id),
		);

		await formState.save();
		await interaction.editReply({
			components: [container],
			flags: [MessageFlags.IsComponentsV2],
		});
	}

	@Button('createOrg')
	public async createOrgBtn(@Context() [interaction]: ButtonContext) {
		const { modal } = this.kothUI.buildEditOrgModal();
		interaction.showModal(modal);
	}

	@Modal('createNewOrg')
	public async onCreateOrgModal(@Context() [interaction]: ModalContext) {
		const name = interaction.fields.getTextInputValue('orgName');
		const invite = interaction.fields.getTextInputValue('orgInvite');
		const owner = interaction.fields
			.getSelectedUsers('orgOwner')
			.map((u) => u.id)[0];
		const admins = interaction.fields
			.getSelectedUsers('orgAdmins')
			.map((u) => u.id);

		console.log(name, invite, owner, admins);
	}
}
