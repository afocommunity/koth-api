import {
	CreationOptional,
	ForeignKey as ForeignKeyType,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
} from 'sequelize';
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { Organization } from './organization.model';
import { Server } from './server.model';

@Table({ timestamps: false, tableName: 'api_tokens' })
export class ApiToken extends Model<
	InferAttributes<ApiToken>,
	InferCreationAttributes<ApiToken>
> {
	@PrimaryKey
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@ForeignKey(() => Organization)
	@Column(DataType.STRING(26))
	declare org_id: ForeignKeyType<Organization['id']>;

	@ForeignKey(() => Server)
	@Column(DataType.STRING(26))
	declare server_id: ForeignKeyType<Server['id']>;

	@Column(DataType.DATE)
	declare expiresAt: Date;

	@BelongsTo(() => Organization)
	declare organization: NonAttribute<Organization>;

	@BelongsTo(() => Server)
	declare server: NonAttribute<Server>;
}
