import {
	ActivityType,
	CacheType,
	ChatInputCommandInteraction,
	Client,
	Events,
	GatewayIntentBits,
	Interaction,
	MessageContextMenuCommandInteraction,
	PresenceUpdateStatus,
	PrimaryEntryPointCommandInteraction,
	UserContextMenuCommandInteraction,
} from 'discord.js';

let client: Client;
let isReady = false;
let isEnabled = false;
let resolve: (value: unknown) => unknown;
const readyPromise = new Promise((res, _rej) => {
	resolve = res;
});
if (process.env.DISCORD_TOKEN) isEnabled = true;

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
		// ¯\_(ツ)_/¯ - Uh oh
	}
	public static async onCommand(
		_interaction:
			| ChatInputCommandInteraction<CacheType>
			| MessageContextMenuCommandInteraction<CacheType>
			| UserContextMenuCommandInteraction<CacheType>
			| PrimaryEntryPointCommandInteraction<CacheType>,
	) {}

	public static async onReady() {
		isReady = true;
		resolve(true);
		console.info('[DISCORD] Client Ready');
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
	}
}
