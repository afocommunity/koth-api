export default {
	regex:
		/^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: \[SQLogOutputAndMessage\] BP_Ruleset_KOTH_C_\d* KOTH NOTIFY: Sent player: (\d+) items for store: (.*) originating from unmodified id: (.*)/,
	onMatch: (args, logParser) => {
		const data = {
			raw: args[0],
			time: args[1],
			chainID: args[2],
			SteamID: args[3],
			item: args[4],
			origin_id: '$' + args[5],
		};
		logParser.emit('KOTH_ITEM_RECEIVE', data);
	},
};
