export default {
	regex:
		/^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: \[SQLogOutputAndMessage\] BP_Ruleset_KOTH_C_\d* KOTH NOTIFY: Player: (\d+) save updated\./,
	onMatch: (args, logParser) => {
		const data = {
			raw: args[0],
			time: args[1],
			chainID: args[2],
			SteamID: args[3],
		};
		logParser.emit('KOTH_SAVE_UPDATE', data);
	},
};
