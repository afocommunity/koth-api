import { BaseCommand } from '@/commands/BaseCommand';
import { green, red, yellow } from 'colors';
import {
	ActivityType,
	AnySelectMenuInteraction,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Collection,
	ContainerBuilder,
	Events,
	GatewayIntentBits,
	Interaction,
	MessageContextMenuCommandInteraction,
	MessageFlags,
	PresenceUpdateStatus,
	PrimaryEntryPointCommandInteraction,
	REST,
	Routes,
	SlashCommandBuilder,
	UserContextMenuCommandInteraction,
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
const commands = new Collection<
	string,
	{ data: BaseCommand; builder: SlashCommandBuilder }
>();

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
			return DiscordController.onCommand(interaction);
		}
		if (interaction.isAnySelectMenu()) {
			return DiscordController.onSelect(interaction);
		}
		// ¯\_(ツ)_/¯ - Uh oh
	}
	public static async onSelect(interaction: AnySelectMenuInteraction) {
		//TODO: Rework this to be modular
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const resp = new ContainerBuilder().addTextDisplayComponents((text) =>
			text.setContent(`You selected ${interaction.values.join(',')}`),
		);
		interaction.editReply({
			components: [resp],
			flags: MessageFlags.IsComponentsV2,
		});
	}
	public static async onCommand(
		interaction:
			| ChatInputCommandInteraction<CacheType>
			| MessageContextMenuCommandInteraction<CacheType>
			| UserContextMenuCommandInteraction<CacheType>
			| PrimaryEntryPointCommandInteraction<CacheType>,
	) {
		console.log(interaction);
		if (!interaction.isChatInputCommand()) return;
		const name = interaction.commandName;
		if (commands.has(name)) {
			commands.get(name).data.execute(interaction);
		}
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
				const command = loaded.build();
				commands.set(command.name, { builder: command, data: loaded });
			} else {
				console.info(red(`Failed to load ${module.default?.name}`));
			}
		}
		console.groupEnd();
		console.info(
			`Loaded ${files.length} Discord modules. ${commands.size ? green(`${commands.size} loaded.`) : ''} ${files.length != commands.size ? yellow(`${files.length - commands.size} failed.`) : ''}`,
		);
		// DiscordController.registerCommands(); //? Register command changes
	}

	public static async registerCommands() {
		const rest = new REST().setToken(process.env.DISCORD_TOKEN);
		const rawJSON = [...commands.map((e) => e.builder.toJSON())];
		await rest.put(
			Routes.applicationCommands(DiscordController.client.application.id),
			{ body: rawJSON },
		);
	}
}
