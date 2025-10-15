import {
	CreationOptional,
	ForeignKey,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
} from 'sequelize';
import {
	BelongsTo,
	Column,
	DataType,
	Default,
	HasOne,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { createId } from '@/utils/createId';
import { Organization } from './organization.model';
import { ApiToken } from './api-token.model';

@Table({ timestamps: true, tableName: 'servers' })
export class Server extends Model<
	InferAttributes<Server>,
	InferCreationAttributes<Server>
> {
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@Column(DataType.STRING(26))
	declare org_id: ForeignKey<Organization['id']>;

	@Column(DataType.STRING(255))
	declare name: string;

	@BelongsTo(() => Organization)
	declare organization: NonAttribute<Organization>;

	@HasOne(() => ApiToken)
	declare apiToken: NonAttribute<ApiToken>;

	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
}
