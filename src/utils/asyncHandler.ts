import { NextFunction, Request, Response } from 'express';

export const asyncHandler = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	fn: (arg0: Request, arg1: Response, arg2: NextFunction) => any,
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		return Promise.resolve(fn(req, res, next)).catch(next);
	};
};
