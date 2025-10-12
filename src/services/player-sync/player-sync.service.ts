import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from '../player/player.model';
import { PlayerSave } from '@/models/player-save.model';
import { LoadoutItem } from '@/models/loudout-item.model';
import { WeaponXP } from '@/models/weapon-xp.model';
import { PermaUnlocks } from '@/models/perma-unlock.model';
import { Sequelize } from 'sequelize-typescript';

export interface UpsertPlayerData {
	steam_id?: string;
	eos_id: string;
	last_known_as: string;
	last_known_at: string;
	last_seen_on: string;
	last_seen_at: string;
	save_file?: {
		cash: number;
		cash_total: number;
		xp: number;
		xp_total: number;
		skin_indfor: string;
		skin_blufor: string;
		skin_redfor: string;
		perk1?: string;
		perk2?: string;
		perk3?: string;
		version: string;
		loadout: Array<{
			family_name: string;
			item: string;
			slot: number;
			item_count: number;
		}>;
		weapon_xp: Array<{
			weapon_name: string;
			xp: number;
		}>;
		perma_unlocks?: Array<{
			unlock_name: string;
		}>;
	};
}

@Injectable()
export class PlayerSyncService {
	constructor(
		@InjectModel(Player) private readonly playerModel: typeof Player,
		@InjectModel(PlayerSave)
		private readonly playerSaveModel: typeof PlayerSave,
		@InjectModel(LoadoutItem)
		private readonly loadoutItemModel: typeof LoadoutItem,
		@InjectModel(WeaponXP) private readonly weaponXPModel: typeof WeaponXP,
		@InjectModel(PermaUnlocks)
		private readonly permaUnlocksModel: typeof PermaUnlocks,
		private readonly sequelize: Sequelize,
	) {}

	/**
	 * Upserts a player with all nested data (save file, loadout, weapon XP, perma unlocks)
	 * Uses a transaction to ensure atomicity
	 */
	public async upsertPlayer(data: UpsertPlayerData) {
		return this.sequelize.transaction(async (transaction) => {
			// Upsert the player record
			const [player] = await this.playerModel.upsert(
				{
					steam_id: data.steam_id,
					eos_id: data.eos_id,
					last_known_as: data.last_known_as,
					last_known_at: new Date(data.last_known_at),
					last_seen_on: data.last_seen_on,
					last_seen_at: new Date(data.last_seen_at),
				},
				{ transaction },
			);

			// If save file data is provided, upsert it
			if (data.save_file) {
				// Upsert the player save
				const [playerSave] = await this.playerSaveModel.upsert(
					{
						owner_id: player.id,
						cash: data.save_file.cash,
						cash_total: data.save_file.cash_total,
						xp: data.save_file.xp,
						xp_total: data.save_file.xp_total,
						skin_indfor: data.save_file.skin_indfor,
						skin_blufor: data.save_file.skin_blufor,
						skin_redfor: data.save_file.skin_redfor,
						perk1: data.save_file.perk1,
						perk2: data.save_file.perk2,
						perk3: data.save_file.perk3,
						version: data.save_file.version,
					},
					{ transaction },
				);

				// Delete existing loadout items and replace with new ones
				await this.loadoutItemModel.destroy({
					where: { save_id: playerSave.id },
					transaction,
				});

				if (data.save_file.loadout && data.save_file.loadout.length > 0) {
					await this.loadoutItemModel.bulkCreate(
						data.save_file.loadout.map((item) => ({
							save_id: playerSave.id,
							family_name: item.family_name,
							item: item.item,
							slot: item.slot,
							item_count: item.item_count,
						})),
						{ transaction },
					);
				}

				// Delete existing weapon XP and replace with new ones
				await this.weaponXPModel.destroy({
					where: { save_id: playerSave.id },
					transaction,
				});

				if (data.save_file.weapon_xp && data.save_file.weapon_xp.length > 0) {
					await this.weaponXPModel.bulkCreate(
						data.save_file.weapon_xp.map((xp) => ({
							save_id: playerSave.id,
							weapon_name: xp.weapon_name,
							xp: xp.xp,
						})),
						{ transaction },
					);
				}

				// Delete existing perma unlocks and replace with new ones
				await this.permaUnlocksModel.destroy({
					where: { save_id: playerSave.id },
					transaction,
				});

				if (
					data.save_file.perma_unlocks &&
					data.save_file.perma_unlocks.length > 0
				) {
					await this.permaUnlocksModel.bulkCreate(
						data.save_file.perma_unlocks.map((unlock) => ({
							save_id: playerSave.id,
							unlock_name: unlock.unlock_name,
						})),
						{ transaction },
					);
				}
			}

			// Return the player with all nested data
			return this.playerModel
				.scope('savefile')
				.findOne({ where: { id: player.id }, transaction });
		});
	}

	/**
	 * Bulk upserts multiple players
	 * Processes each player individually within their own transaction
	 */
	public async bulkUpsertPlayers(players: UpsertPlayerData[]) {
		const results = await Promise.allSettled(
			players.map((player) => this.upsertPlayer(player)),
		);

		const successful = results.filter((r) => r.status === 'fulfilled');
		const failed = results.filter((r) => r.status === 'rejected');

		return {
			total: players.length,
			successful: successful.length,
			failed: failed.length,
			results: results.map((result, index) => ({
				index,
				eos_id: players[index].eos_id,
				status: result.status,
				error:
					result.status === 'rejected' ? result.reason?.message : undefined,
			})),
		};
	}
}
