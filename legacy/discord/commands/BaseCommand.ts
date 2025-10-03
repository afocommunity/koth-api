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

/**
 * Abstract base class for Discord command modules
 * Defines the structure for building commands, buttons, modals, autocomplete, and select menus
 * Provides optional execute methods for handling interactions
 */
export abstract class BaseCommand {
	abstract build(): BaseCommandBuilder;

	/**
	 * Optional method to execute a slash command interaction
	 */
	public async executeCommand?(
		interaction: CommandInteraction,
	): Promise<unknown>;

	/**
	 * Optional method to execute a button interaction
	 */
	public async executeButton?(interaction: ButtonInteraction): Promise<unknown>;

	/**
	 * Optional method to execute a modal submit interaction
	 */
	public async executeModal?(
		interaction: ModalSubmitInteraction,
	): Promise<unknown>;

	/**
	 * Optional method to execute an autocomplete interaction
	 */
	public async executeAutocomplete?(
		interaction: AutocompleteInteraction,
	): Promise<unknown>;

	/**
	 * Optional method to execute a select menu interaction
	 */
	public async executeSelect?(
		interaction: AnySelectMenuInteraction,
	): Promise<unknown>;
}
