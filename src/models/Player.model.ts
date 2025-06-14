import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize';
import {
	AllowNull,
	Column,
	DataType,
	Default,
	HasOne,
	Model,
	PrimaryKey,
	Scopes,
	Table,
	Unique,
} from 'sequelize-typescript';
import { createId } from '@paralleldrive/cuid2';
import { PlayerSave } from './PlayerSave.model';
import { NonAttribute } from 'sequelize';
import { LoadoutItem } from './LoadoutItem.model';
import { WeaponXP } from './WeaponXP.model';

@Scopes(() => ({
	savefile: {
		include: {
			model: PlayerSave,
			as: 'SaveFile',
			include: [
				{ model: LoadoutItem, as: 'Loadout' },
				{ model: WeaponXP, as: 'WeaponXP' },
			],
		},
	},
}))
@Table({ timestamps: true, tableName: 'players' })
export class Player extends Model<
	InferAttributes<Player>,
	InferCreationAttributes<Player>
> {
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;
	@Unique
	@AllowNull
	@Column(DataType.STRING(17))
	declare steam_id: string;
	@Unique
	@Column(DataType.STRING(32))
	declare eos_id: string;

	@Column(DataType.STRING)
	declare last_known_as: string;
	@Column(DataType.DATE)
	declare last_known_at: Date;

	@Column(DataType.STRING)
	declare last_seen_on: string;
	@Column(DataType.DATE)
	declare last_seen_at: Date;

	@HasOne(() => PlayerSave)
	declare SaveFile: NonAttribute<Awaited<PlayerSave>>;

	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
}
