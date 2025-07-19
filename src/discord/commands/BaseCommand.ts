import {
	AnySelectMenuInteraction,
	AutocompleteInteraction,
	ButtonInteraction,
	CommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js';
export type BaseCommandBuilder = {
	commands?: SlashCommandBuilder[];
	buttons?: string[];
	autocomplete?: string[];
	modals?: string[];
	select?: string[];
};
export abstract class BaseCommand {
	abstract build(): BaseCommandBuilder;
	public async executeCommand?(
		interaction: CommandInteraction,
	): Promise<unknown>;
	public async executeButton?(interaction: ButtonInteraction): Promise<unknown>;
	public async executeModal?(
		interaction: ModalSubmitInteraction,
	): Promise<unknown>;
	public async executeAutocomplete?(
		interaction: AutocompleteInteraction,
	): Promise<unknown>;
	public async executeSelect?(
		interaction: AnySelectMenuInteraction,
	): Promise<unknown>;
}
