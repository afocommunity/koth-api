import { Interaction, SlashCommandBuilder } from 'discord.js';

export abstract class BaseCommand {
	abstract register(command): SlashCommandBuilder;
	abstract execute(interaction: Interaction);
}
