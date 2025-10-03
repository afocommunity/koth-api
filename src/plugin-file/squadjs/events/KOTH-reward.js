export default {
	regex:
		/^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: \[SQLogOutputAndMessage\] BP_Ruleset_KOTH_C_\d* KOTH NOTIFY: Rewarding Player: (\d+): (.*): (.*)XP \$(.*)/,
	onMatch: (args, logParser) => {
		const data = {
			raw: args[0],
			time: args[1],
			chainID: args[2],
			SteamID: args[3],
			reason: args[4],
			xp: parseFloat(args[5]),
			money: parseFloat(args[6]),
		};
		logParser.emit('KOTH_REWARD', data);
	},
};
