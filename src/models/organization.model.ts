import {
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
} from 'sequelize';
import {
	Column,
	DataType,
	Default,
	HasMany,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript';
import { createId } from '@/utils/createId';
import { Server } from './server.model';

@Table({ timestamps: true, tableName: 'organizations' })
export class Organization extends Model<
	InferAttributes<Organization>,
	InferCreationAttributes<Organization>
> {
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@Column(DataType.STRING(255))
	declare name: string;

	@HasMany(() => Server)
	declare servers: NonAttribute<Server[]>;

	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
}
