export default {
	regex:
		/^\[([0-9.:-]+)]\[([ 0-9]*)]LogSquad: \[SQLogOutputAndMessage\] BP_Ruleset_KOTH_C_\d* KOTH NOTIFY: Points Updated: blufor: (\d*) redfor: (\d*) indfor: (\d*)/,
	onMatch: (args, logParser) => {
		const data = {
			raw: args[0],
			time: args[1],
			chainID: args[2],
			blufor: args[3],
			redfor: args[4],
			indfor: args[5],
		};
		logParser.eventStore.KOTH_TICKETS = data;
	},
};
