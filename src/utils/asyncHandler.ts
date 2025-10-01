import { NextFunction, Request, Response } from 'express';

/**
 * Wraps asynchronous Express route handlers to catch errors and pass them to the next middleware
 * @param fn - One or more asynchronous route handler functions
 * @returns An array of wrapped route handler functions
 */
export const asyncHandler = (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	...fn: ((arg0: Request, arg1: Response, arg2: NextFunction) => any)[]
) => {
	return fn.map((fn) => (req: Request, res: Response, next: NextFunction) => {
		return Promise.resolve(fn(req, res, next)).catch(next);
	});
};
