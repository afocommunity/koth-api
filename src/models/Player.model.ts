import {
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from "sequelize";
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import { LoadoutItem } from "./LoadoutItem.model";

@Table({ timestamps: true })
export class Player extends Model<
  InferAttributes<Player>,
  InferCreationAttributes<Player>
> {
  @PrimaryKey
  @Column(DataType.STRING(17))
  declare steamid: string;

  @Unique
  @Column(DataType.STRING(32))
  declare eosid: string;

  @Column(DataType.STRING(40))
  declare last_known_as: string;

  @Column(DataType.INTEGER)
  declare cash: number;
  @Column(DataType.INTEGER)
  declare total_cash: number;

  @Column(DataType.INTEGER)
  declare xp: number;
  @Column(DataType.INTEGER)
  declare total_xp: number;

  @Column(DataType.STRING(255))
  declare skin_indfor: string;
  @Column(DataType.STRING(255))
  declare skin_blufor: string;
  @Column(DataType.STRING(255))
  declare skin_redfor: string;

  @Column(DataType.STRING)
  declare version: string;

  @HasMany(() => LoadoutItem)
  loadout: NonAttribute<Awaited<LoadoutItem>>;
  getLoadouts: HasManyGetAssociationsMixin<Awaited<LoadoutItem>>;
  setLoadouts: HasManySetAssociationsMixin<Awaited<LoadoutItem>, string>;
}
