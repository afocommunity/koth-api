import { migrator } from './migrator';
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
	app.use(routing);

	//? Handling
	app.use(
		(
			data: ZodError | Error | DTO<unknown>,
			_req: Request,
			res: Response,
			_next: NextFunction,
		) => {
			console.log('e', data);
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
			return;
		},
	);

	app.listen(EXPRESS_PORT, () =>
		console.info(`Listening on port ${EXPRESS_PORT}`),
	);
};
