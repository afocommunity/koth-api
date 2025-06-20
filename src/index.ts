import 'dotenv/config';
import 'reflect-metadata';

import { createServer } from './createServer';
import { yellow, red, green } from 'colors';

//! ENV Check
let failed = false;
const checkEnvar = (envar: string, optional = true) => {
	if (process.env[envar] == null) {
		let color = yellow;
		if (!optional) {
			failed = true;
			color = red;
		}
		console.error(color(`Missing envar "${envar}". Optional: ${optional}`));
	} else console.info(green(`Loaded envar  "${envar}". Optional: ${optional}`));
};

checkEnvar('DB_DIALECT', false);
checkEnvar('DB_HOST', false);
checkEnvar('DB_USER', false);
checkEnvar('DB_PASSWORD', false);
checkEnvar('DB_DATABASE', false);
checkEnvar('DISCORD_TOKEN', true);

if (failed) {
	throw 'Missing required envar';
}

createServer();
