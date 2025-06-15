import { Request, Response, NextFunction } from 'express';
import { IdType } from '@/commands/IdType';
import { PlayerScope } from '@/commands/scope';
import { Player } from '@/models/Player.model';
import { DTO } from '@/utils/DTO';

export class PlayerController {
	public static async findPlayer(
		req: Request,
		_res: Response,
		next: NextFunction,
	) {
		const player_id = req.params.player_id;
		const id_type = IdType.parse(req.query.by);
		const scope = Array.from(
			new Set(
				PlayerScope.parse(
					req.query.include != null
						? typeof req.query.include === 'string'
							? req.query.include.split(',')
							: req.query.include
						: null,
				),
			),
		);
		switch (id_type) {
			case 'native':
				return next(await PlayerController.getPlayerByID(player_id, scope));
			case 'steam':
				return next(await PlayerController.getPlayerBySteam(player_id, scope));
			case 'eos':
				return next(await PlayerController.getPlayerByEOS(player_id, scope));
		}
	}
	private static async getPlayerByID(id: string, scope = ['savefile']) {
		const player = await Player.scope(scope).findOne({ where: { id } });
		return new DTO(player, player != null ? 200 : 404);
	}
	private static async getPlayerByEOS(id: string, scope = ['savefile']) {
		const player = await Player.scope(scope).findOne({ where: { eos_id: id } });
		return new DTO(player, player != null ? 200 : 404);
	}
	private static async getPlayerBySteam(id: string, scope = ['savefile']) {
		const player = await Player.scope(scope).findOne({
			where: { steam_id: id },
		});
		return new DTO(player, player != null ? 200 : 404);
	}
}
