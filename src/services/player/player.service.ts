import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from './player.model';

@Injectable()
export class PlayerService {
	constructor(
		@InjectModel(Player) private readonly playerModel: typeof Player,
	) {}

	public async findPlayer(
		id: string,
		type: 'native' | 'steam' | 'eos' = 'native',
		include = ['savefile'],
	) {
		switch (type) {
			case 'native':
				return this.getPlayerByID(id, include);
			case 'steam':
				return this.getPlayerBySteam(id, include);
			case 'eos':
				return this.getPlayerByEOS(id, include);
		}
	}

	/**
	 * Retrieves a player by their native ID
	 * Includes related data based on the 'include' parameter
	 */
	public async getPlayerByID(id: string, include = ['savefile']) {
		return this.playerModel.scope(include).findOne({ where: { id } });
	}
	/**
	 * Retrieves a player by their EOS ID
	 * Includes related data based on the 'include' parameter
	 */
	public async getPlayerByEOS(id: string, include = ['savefile']) {
		return this.playerModel.scope(include).findOne({ where: { eos_id: id } });
	}
	/**
	 * Retrieves a player by their Steam ID
	 * Includes related data based on the 'include' parameter
	 */
	public async getPlayerBySteam(id: string, include = ['savefile']) {
		return this.playerModel.scope(include).findOne({ where: { steam_id: id } });
	}
}
