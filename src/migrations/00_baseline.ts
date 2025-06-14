import { Migration } from '@/migrator';
import { DataType } from 'sequelize-typescript';

export const up: Migration = async ({ context: sequelize }) => {
	await sequelize.createTable('players', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		steam_id: {
			type: DataType.STRING(17),
			allowNull: true,
			unique: true,
		},
		eos_id: {
			type: DataType.STRING(32),
			allowNull: true,
			unique: true,
		},
		last_known_as: {
			type: DataType.STRING(),
		},
		last_known_at: {
			type: DataType.DATE(),
		},
		last_seen_on: {
			type: DataType.STRING(),
		},
		last_seen_at: {
			type: DataType.DATE(),
		},
		createdAt: {
			type: DataType.DATE(),
		},
		updatedAt: {
			type: DataType.DATE(),
		},
	});
	await sequelize.createTable('player_saves', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		owner_id: {
			type: DataType.STRING(26),
			references: { model: 'players' },
		},
		cash: {
			type: DataType.INTEGER(),
		},
		cash_total: {
			type: DataType.INTEGER(),
		},
		xp: {
			type: DataType.INTEGER(),
		},
		xp_total: {
			type: DataType.INTEGER(),
		},
		skin_indfor: {
			type: DataType.STRING(),
		},
		skin_blufor: {
			type: DataType.STRING(),
		},
		skin_redfor: {
			type: DataType.STRING(),
		},
		version: {
			type: DataType.STRING(),
		},
		perk1: {
			type: DataType.STRING(),
			allowNull: true,
		},
		perk2: {
			type: DataType.STRING(),
			allowNull: true,
		},
		perk3: {
			type: DataType.STRING(),
			allowNull: true,
		},
		createdAt: {
			type: DataType.DATE(),
		},
		updatedAt: {
			type: DataType.DATE(),
		},
	});
	await sequelize.createTable('player_loadouts', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		save_id: {
			type: DataType.STRING(26),
			references: { model: 'player_saves' },
		},
		family_name: {
			type: DataType.STRING(),
		},
		item: {
			type: DataType.STRING(),
		},
		slot: {
			type: DataType.INTEGER(),
		},
		item_count: {
			type: DataType.INTEGER(),
		},
	});
	await sequelize.createTable('player_weapon_xp', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		save_id: {
			type: DataType.STRING(26),
			references: { model: 'player_saves' },
		},
		weapon_name: {
			type: DataType.STRING(),
		},
		xp: {
			type: DataType.INTEGER(),
		},
	});
	await sequelize.createTable('player_perma_unlocks', {
		id: {
			type: DataType.STRING(26),
			primaryKey: true,
		},
		save_id: {
			type: DataType.STRING(26),
			references: { model: 'player_saves' },
		},
		unlock_name: {
			type: DataType.STRING(),
		},
	});
};
export const down: Migration = async ({ context: sequelize }) => {
	await sequelize.dropTable('player_loadouts');
	await sequelize.dropTable('player_saves');
	await sequelize.dropTable('player_weapon_xp');
	await sequelize.dropTable('player_perma_unlocks');
	await sequelize.dropTable('players');
};
