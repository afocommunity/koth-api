import { createMigrator } from './migrator';
import express, {
	json,
	Request,
	Response,
	NextFunction,
	urlencoded,
} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import { routing } from './routes';
import { ZodError } from 'zod';
import { DTO } from './utils/DTO';
import { AuthMiddleware } from './middleware/Auth';
import { AuthController } from './controllers/AuthController';
import { DiscordController } from './controllers/DiscordController';
const FRONTEND_HOST = process.env.FRONTEND_HOST ?? 'http://localhost:3000';
const EXPRESS_PORT = process.env.EXPRESS_PORT ?? 3030;
export const createServer = async () => {
	const migrator = createMigrator();
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
	app.use(AuthMiddleware.configureRequest);
	app.use(routing);
	//? Cron Jobs
	AuthController.setupCron();
	DiscordController.setupCron();
	//? Misc Setup
	await DiscordController.setup();
	//? Handling
	app.use(
		(
			data: ZodError | Error | DTO<unknown>,
			_req: Request,
			res: Response,
			_next: NextFunction,
		) => {
			if (data instanceof DTO) {
				res.status(data.status).json(data);
				return;
			}

			if (data instanceof ZodError) {
				res.status(400).json(data);
				return;
			}

			res
				.status(500)
				.json(
					process.env.environment === 'production'
						? data
						: new Error('internal server error'),
				);
		},
	);
	app.listen(EXPRESS_PORT, () =>
		console.info(`Listening on port ${EXPRESS_PORT}`),
	);
};
