import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
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
import { createId } from '@/utils/createId';
import { PlayerSave } from '../../models/player-save.model';

import { LoadoutItem } from '../../models/loudout-item.model';
import { WeaponXP } from '../../models/weapon-xp.model';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({ name: 'Player', description: 'Player Model' })
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
	@ApiProperty()
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@ApiProperty()
	@Unique
	@AllowNull
	@Column(DataType.STRING(17))
	declare steam_id: string;

	@ApiProperty()
	@Unique
	@Column(DataType.STRING(32))
	declare eos_id: string;

	@ApiProperty()
	@Column(DataType.STRING)
	declare last_known_as: string;
	@ApiProperty()
	@Column(DataType.DATE)
	declare last_known_at: Date;

	@ApiProperty()
	@Column(DataType.STRING)
	declare last_seen_on: string;
	@ApiProperty()
	@Column(DataType.DATE)
	declare last_seen_at: Date;

	@ApiProperty()
	@HasOne(() => PlayerSave)
	declare SaveFile: NonAttribute<Awaited<PlayerSave>>;

	@ApiProperty()
	declare readonly createdAt: CreationOptional<Date>;
	@ApiProperty()
	declare readonly updatedAt: CreationOptional<Date>;
}
