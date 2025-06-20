import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware {
	public static bearerTokenAuth(_requiredPermission: unknown) {
		return async (_req: Request, _res: Response, next: NextFunction) => {
			//TODO Auth
			next();
		};
	}
}
