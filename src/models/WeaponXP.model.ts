import { createId } from '@/utils/createId';
import { CreationOptional, NonAttribute } from 'sequelize';
import {
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { PlayerSave } from './PlayerSave.model';

@Table({ timestamps: false, tableName: 'player_weapon_xp' })
export class WeaponXP extends Model {
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(24))
	declare id: CreationOptional<string>;

	@ForeignKey(() => PlayerSave)
	@Column(DataType.STRING(24))
	declare save_id: string;
	@BelongsTo(() => PlayerSave)
	declare readonly PlayerSave: NonAttribute<Awaited<PlayerSave>>;

	@Column(DataType.STRING)
	declare weapon_name: string;
	@Column(DataType.INTEGER)
	declare xp: number;
}
