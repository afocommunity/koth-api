export default {
	regex:
		/^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: \[SQLogOutputAndMessage\] BP_Ruleset_KOTH_C_\d* KOTH NOTIFY: Player: (\d+) Purchased: (.*) for: \$(.*)/,
	onMatch: (args, logParser) => {
		const data = {
			raw: args[0],
			time: args[1],
			chainID: args[2],
			SteamID: args[3],
			purchase: args[4],
			priceRaw: '$' + args[5],
			price: args[5],
		};
		logParser.emit('KOTH_PURCHASE', data);
	},
};
