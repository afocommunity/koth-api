export default {
	regex:
		/^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: \[SQLogOutputAndMessage\] BP_Ruleset_KOTH_C_\d* KOTH NOTIFY: Player: (\d+) Halo Jumped/,
	onMatch: (args, logParser) => {
		const data = {
			raw: args[0],
			time: args[1],
			chainID: args[2],
			SteamID: args[3],
		};
		logParser.emit('KOTH_HALO_JUMP', data);
	},
};
