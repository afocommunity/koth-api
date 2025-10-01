import { Request, Response, NextFunction } from 'express';
import { IdType } from '@/schemas/IdType';
import { PlayerScope } from '@/schemas/scope';
import { Player } from '@/models/Player.model';
import { DTO } from '@/utils/DTO';

/**
 * Controller for managing player-related operations
 */
export class PlayerController {
	/**
	 * Middleware to find a player based on request parameters
	 * Supports searching by native ID, Steam ID, or EOS ID
	 * Includes related data based on the 'include' query parameter
	 * Injects the found player into the next middleware or returns 404 if not found
	 */
	public static async reqFindPlayer(
		req: Request,
		_res: Response,
		next: NextFunction,
	) {
		const player_id = req.params.player_id;
		const id_type = IdType.parse(req.query.by);
		const include = Array.from(
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
				return next(await PlayerController.getPlayerByID(player_id, include));
			case 'steam':
				return next(
					await PlayerController.getPlayerBySteam(player_id, include),
				);
			case 'eos':
				return next(await PlayerController.getPlayerByEOS(player_id, include));
		}
	}

	/**
	 * Retrieves a player by their native ID, Steam ID, or EOS ID
	 * Includes related data based on the 'include' parameter
	 * Returns a DTO with the player data or 404 if not found
	 */
	public static async getPlayerByID(id: string, include = ['savefile']) {
		const player = await Player.scope(include).findOne({ where: { id } });
		return new DTO(player, player != null ? 200 : 404);
	}

	/**
	 * Retrieves a player by their EOS ID
	 * Includes related data based on the 'include' parameter
	 * Returns a DTO with the player data or 404 if not found
	 */
	public static async getPlayerByEOS(id: string, include = ['savefile']) {
		const player = await Player.scope(include).findOne({
			where: { eos_id: id },
		});
		return new DTO(player, player != null ? 200 : 404);
	}

	/**
	 * Retrieves a player by their Steam ID
	 * Includes related data based on the 'include' parameter
	 * Returns a DTO with the player data or 404 if not found
	 */
	public static async getPlayerBySteam(id: string, include = ['savefile']) {
		const player = await Player.scope(include).findOne({
			where: { steam_id: id },
		});
		return new DTO(player, player != null ? 200 : 404);
	}
}
