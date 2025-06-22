import { AuthController } from '@/controllers/AuthController';
import { ApiToken } from '@/models/ApiToken.model';
import { DTO } from '@/utils/DTO';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Op } from 'sequelize';

export class AuthMiddleware {
	public static async configureRequest(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const bearerHeader: string | undefined = req.headers['authorization'];
		const api_key: string | undefined =
			(req.headers['x-api-key'] as string) ?? (req.query.api_key as string);
		if (bearerHeader == null && api_key == null) return next();
		let tokenPayload: JwtPayload;
		if (bearerHeader != null) {
			//? Bearer Token
			const [type, token] = bearerHeader?.split?.(' ') ?? [null, null];
			if (type !== 'Bearer') return next();
			if (token == null) return next();
			tokenPayload = await AuthController.decodeAuthToken(token);
		} else {
			tokenPayload = await AuthController.decodeAuthToken(api_key);
		}
		if (tokenPayload == null) return next();

		const valid = await ApiToken.findOne({
			where: {
				id: tokenPayload.jti,
				expiresAt: { [Op.gte]: Date.now() },
			},
		});

		if (valid == null) return next();

		//! Inject into res locals object
		res.locals.auth = {
			org_id: valid.org_id,
			server_id: valid.server_id,
			token_id: valid.id,
			expires: valid.expiresAt,
		};
		next();
	}
	public static bearerTokenAuth() {
		return async (_req: Request, res: Response, next: NextFunction) => {
			if (res.locals.auth == null)
				return next(new DTO('Invalid Credentials', 401));
			next();
		};
	}
}
