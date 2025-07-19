import { buildPlugin } from '@/squadjs/buildPluginFile';
import { CURRENT_PLUGIN_VERSION } from '@/squadjs/CURRENT_PLUGIN_VERSION';
import { DTO } from '@/utils/DTO';
import { Request, Response, NextFunction } from 'express';

export class PluginController {
	public static async reqDownload(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const plugin = await buildPlugin();
		if (req.headers.accept === 'application/json') {
			return next(new DTO(plugin));
		}
		return res
			.status(200)
			.header('Content-Type', 'text/javascript; charset=utf-8')
			.send(plugin)
			.end();
	}
	public static async reqVersion(
		_req: Request,
		_res: Response,
		next: NextFunction,
	) {
		next(new DTO(CURRENT_PLUGIN_VERSION));
	}
}
