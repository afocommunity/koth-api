import { BaseCommand } from '@/commands/BaseCommand';
import { green, red, yellow } from 'colors';
import {
	ActivityType,
	CacheType,
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Interaction,
	PresenceUpdateStatus,
	REST,
	Routes,
	SlashCommandBuilder,
} from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

let client: Client;
let isReady = false;
let isEnabled = false;
let resolve: (value: unknown) => unknown;
const readyPromise = new Promise((res, _rej) => {
	resolve = res;
});
if (process.env.DISCORD_TOKEN) isEnabled = true;
const commandRegistry = new Collection<
	string,
	{ data: BaseCommand; builder: SlashCommandBuilder }
>();

const buttonRegistry = new Collection<string, { data: BaseCommand }>();

const modalRegistry = new Collection<string, { data: BaseCommand }>();

const autocompleteRegistry = new Collection<string, { data: BaseCommand }>();
const selectRegistry = new Collection<string, { data: BaseCommand }>();

export class DiscordController {
	public static get client(): Client<true> | null {
		if (DiscordController.ready) return client as Client<true>;
		return null;
	}
	public static get enabled() {
		return isEnabled;
	}
	public static get ready() {
		return isReady;
	}
	/**For actions that MUST run on startup, but wait for ready */
	public static get readyPromise() {
		return readyPromise;
	}
	public static async setup() {
		if (!DiscordController.enabled) return;
		client = new Client({
			intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
		});
		client.login(process.env.DISCORD_TOKEN);
		client.once(Events.ClientReady, DiscordController.onReady);
		client.on(Events.InteractionCreate, DiscordController.onInteraction);
	}

	public static async onInteraction(interaction: Interaction<CacheType>) {
		if (interaction.isCommand()) {
			const name = interaction.commandName;
			if (commandRegistry.has(name)) {
				commandRegistry.get(name).data.executeCommand?.(interaction);
			}
		}
		if (interaction.isAnySelectMenu()) {
			const name = interaction.customId;
			if (buttonRegistry.has(name)) {
				selectRegistry.get(name).data.executeSelect(interaction);
			}
		}
		if (interaction.isButton()) {
			const name = interaction.customId;
			if (buttonRegistry.has(name)) {
				buttonRegistry.get(name).data.executeButton?.(interaction);
			}
		}
		if (interaction.isModalSubmit()) {
			const name = interaction.customId;
			if (buttonRegistry.has(name)) {
				modalRegistry.get(name).data.executeModal?.(interaction);
			}
		}
		if (interaction.isAutocomplete()) {
			const name = interaction.commandName;
			if (buttonRegistry.has(name)) {
				autocompleteRegistry.get(name).data.executeAutocomplete?.(interaction);
			}
		}
		// ¯\_(ツ)_/¯ - Uh oh
	}

	public static async onReady() {
		isReady = true;
		resolve(true);
		console.info(green('Discord Client Ready'));
		client.user.setPresence({
			status: PresenceUpdateStatus.Online,
			activities: [
				{
					name: 'King of the Hill',
					type: ActivityType.Custom,
					url: 'https://discord.gg/kingofthehill',
					state: 'Capturing the Point',
				},
			],
		});
		DiscordController.setupCommands();
	}

	public static async setupCommands() {
		const root = path.resolve(__dirname, '../commands');
		const files = fs.readdirSync(root);
		console.group('Loading Discord Modules...');
		for (const file of files) {
			const module = await import(path.join(root, file));
			if (module.default == null) {
				console.info(yellow(`Ignoring ${file}. No default export`));
				continue;
			}
			const loaded = new module.default() as BaseCommand;
			if ('build' in loaded && 'execute' in loaded) {
				console.info(
					green(`Loading module ${module.default?.name} from ${file}`),
				);
				const {
					commands = [],
					buttons: events = [],
					modals = [],
					autocomplete = [],
				} = loaded.build();
				for (const command of commands) {
					commandRegistry.set(command.name, { builder: command, data: loaded });
				}
				for (const event of events) {
					buttonRegistry.set(event, { data: loaded });
				}
				for (const modal of modals) {
					modalRegistry.set(modal, { data: loaded });
				}
				for (const event of autocomplete) {
					autocompleteRegistry.set(event, { data: loaded });
				}
			} else {
				console.info(red(`Failed to load ${module.default?.name}`));
			}
		}
		console.groupEnd();
		console.info(
			`Loaded ${files.length} Discord modules. ${commandRegistry.size ? green(`${commandRegistry.size} loaded.`) : ''} ${files.length != commandRegistry.size ? yellow(`${files.length - commandRegistry.size} failed.`) : ''}`,
		);
		// DiscordController.registerCommands(); //? Register command changes
	}

	public static async registerCommands() {
		const rest = new REST().setToken(process.env.DISCORD_TOKEN);
		const rawJSON = [...commandRegistry.map((e) => e.builder.toJSON())];
		await rest.put(
			Routes.applicationCommands(DiscordController.client.application.id),
			{ body: rawJSON },
		);
	}
}
