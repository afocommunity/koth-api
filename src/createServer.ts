import { migrator } from './migrator';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
const FRONTEND_HOST = process.env.FRONTEND_HOST ?? 'http://localhost:3000';
const EXPRESS_PORT = process.env.EXPRESS_PORT ?? 3030;
export const createServer = async () => {
	await migrator.up();
	const app = express();

	app.use(
		morgan(process.env.environment === 'production' ? 'combined' : 'dev'),
	);
	app.use(cors({ origin: [FRONTEND_HOST] }));
	app.use(compression());
	app.disable('x-powered-by');
	app.use(json());
	app.use(urlencoded({ extended: true }));

	app.listen(EXPRESS_PORT, () =>
		console.info(`Listening on port ${EXPRESS_PORT}`),
	);
};
