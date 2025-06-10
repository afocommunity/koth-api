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
import { PlayerFile } from './PlayerFile.model';

@Table({ timestamps: false })
export class LoadoutItem extends Model {
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(24))
	declare id: CreationOptional<string>;

	@ForeignKey(() => PlayerFile)
	@Column(DataType.STRING(24))
	declare owner_id: string;

	@BelongsTo(() => PlayerFile)
	declare readonly Player: NonAttribute<Awaited<PlayerFile>>;

	@Column(DataType.STRING)
	declare family_name: string;
	@Column(DataType.STRING)
	declare item: string;
	@Column(DataType.INTEGER)
	declare slot: number;
	@Column(DataType.INTEGER)
	declare item_count: number;
}
