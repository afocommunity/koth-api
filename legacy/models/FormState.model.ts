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

@Table({ timestamps: true, tableName: 'form_state' })
export class FormState extends Model<
	InferAttributes<FormState>,
	InferCreationAttributes<FormState>
> {
	@PrimaryKey
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@Column(DataType.STRING(20))
	declare message_id: string;

	@Column(DataType.STRING(20))
	declare user_id: string;

	@Column(DataType.STRING(20))
	declare type: string;

	@Column(DataType.TEXT())
	declare data: string;
}
