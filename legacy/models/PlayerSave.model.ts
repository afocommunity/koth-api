import {
	CreationOptional,
	HasManyGetAssociationsMixin,
	HasManySetAssociationsMixin,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
} from 'sequelize';
import {
	AllowNull,
	BelongsTo,
	Column,
	DataType,
	Default,
	ForeignKey,
	HasMany,
	Model,
	PrimaryKey,
	Scopes,
	Table,
} from 'sequelize-typescript';
import { LoadoutItem } from './LoadoutItem.model';
import { createId } from '@paralleldrive/cuid2';
import { Player } from './Player.model';
import { WeaponXP } from './WeaponXP.model';
import { PermaUnlocks } from './PermaUnlocks.model';

@Scopes(() => ({
	loadout: { include: { model: LoadoutItem, as: 'Loadout' } },
	weapon_xp: { include: { model: WeaponXP, as: 'WeaponXP' } },
}))
@Table({ timestamps: true, tableName: 'player_saves' })
export class PlayerSave extends Model<
	InferAttributes<PlayerSave>,
	InferCreationAttributes<PlayerSave>
> {
	@PrimaryKey
	@Default(createId)
	@Column(DataType.STRING(26))
	declare id: CreationOptional<string>;

	@ForeignKey(() => Player)
	@Column(DataType.STRING(26))
	declare owner_id: string;

	@Column(DataType.INTEGER)
	declare cash: number;
	@Column(DataType.INTEGER)
	declare cash_total: number;

	@Column(DataType.INTEGER)
	declare xp: number;
	@Column(DataType.INTEGER)
	declare xp_total: number;

	@Column(DataType.STRING(255))
	declare skin_indfor: string;
	@Column(DataType.STRING(255))
	declare skin_blufor: string;
	@Column(DataType.STRING(255))
	declare skin_redfor: string;

	@AllowNull
	@Column(DataType.STRING)
	declare perk1: string;
	@AllowNull
	@Column(DataType.STRING)
	declare perk2: string;
	@AllowNull
	@Column(DataType.STRING)
	declare perk3: string;

	@Column(DataType.STRING)
	declare version: string;

	@BelongsTo(() => Player)
	declare Player: NonAttribute<Awaited<Player>>;

	@HasMany(() => LoadoutItem)
	Loadout: NonAttribute<Awaited<LoadoutItem>>;
	getLoadouts: HasManyGetAssociationsMixin<Awaited<LoadoutItem>>;
	setLoadouts: HasManySetAssociationsMixin<Awaited<LoadoutItem>, string>;

	@HasMany(() => WeaponXP)
	WeaponXP: NonAttribute<Awaited<WeaponXP>>;
	getWeaponXPs: HasManyGetAssociationsMixin<Awaited<WeaponXP>>;
	setWeaponXPs: HasManySetAssociationsMixin<Awaited<WeaponXP>, string>;

	@HasMany(() => PermaUnlocks)
	PermaUnlocks: NonAttribute<Awaited<PermaUnlocks>>;
	getPermaUnlocks: HasManyGetAssociationsMixin<Awaited<PermaUnlocks>>;
	setPermaUnlocks: HasManySetAssociationsMixin<Awaited<PermaUnlocks>, string>;

	declare readonly createdAt: CreationOptional<Date>;
	declare readonly updatedAt: CreationOptional<Date>;
}
