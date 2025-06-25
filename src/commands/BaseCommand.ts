import { Interaction, SlashCommandBuilder } from 'discord.js';

export abstract class BaseCommand {
	abstract build(command): SlashCommandBuilder;
	abstract execute(interaction: Interaction);
}
