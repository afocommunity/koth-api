import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
} from 'sequelize';
import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';

@Table({ timestamps: false, tableName: 'api_tokens' })
export class ApiToken extends Model<
	InferAttributes<ApiToken>,
	InferCreationAttributes<ApiToken>
> {
	@PrimaryKey
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@Column(DataType.STRING(26))
	declare org_id: string;

	@Column(DataType.STRING(26))
	declare server_id: string;

	@Column(DataType.DATE)
	declare expiresAt: Date;
}
