import { Interaction, SlashCommandBuilder } from 'discord.js';

export abstract class BaseCommand {
	abstract build(): SlashCommandBuilder;
	abstract execute(interaction: Interaction);
}
