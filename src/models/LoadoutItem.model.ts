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

@Table({ timestamps: false, tableName: 'player_loadouts' })
export class LoadoutItem extends Model {
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
	declare family_name: string;
	@Column(DataType.STRING)
	declare item: string;
	@Column(DataType.INTEGER)
	declare slot: number;
	@Column(DataType.INTEGER)
	declare item_count: number;
}
