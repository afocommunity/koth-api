import { yellow, red, green } from 'colors';

/**
 * Determines if all required environment variables are set
 * If a required environment variable is missing, an error is thrown
 * If an optional environment variable is missing, a warning is logged
 */
export const checkENV = () => {
	let failed = false;
	const checkEnvar = (envar: string, optional = true, comment?: string) => {
		if (process.env[envar] == null) {
			let color = yellow;
			if (!optional) {
				failed = true;
				color = red;
			}
			console.error(
				color(
					`Missing envar "${envar}". Optional: ${optional}${comment ? ` Comment: ${comment}` : ''}`,
				),
			);
		} else
			console.info(green(`Loaded envar  "${envar}". Optional: ${optional}`));
	};

	checkEnvar('DB_DIALECT', false);
	checkEnvar('DB_HOST', false);
	checkEnvar('DB_USER', false);
	checkEnvar('DB_PASSWORD', false);
	checkEnvar('DB_DATABASE', false);
	checkEnvar('DISCORD_TOKEN', true);
	checkEnvar(
		'ADMINS',
		false,
		'Comma-delimited list of System Administrator discord IDs',
	); // Make this in the Database
	checkEnvar('AUTH_SECRET', false, "openssl rand -base64 172 | tr -d '\\n'");

	if (failed) {
		throw new Error('Missing required envar');
	}
};
