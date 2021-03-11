import {
  Model, DataTypes,
} from 'sequelize';
import { DatabaseFactory } from '../database-factory';
import { StaticModel } from './StaticModel';

export interface BaseAttributes {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BaseModel extends Model<BaseAttributes>, BaseAttributes { }
export class Base extends Model<BaseModel, BaseAttributes> { }

export function BaseFactory(database: DatabaseFactory): StaticModel<BaseModel> {
  return database.db.define('Base', {
    id: {
      type: DataTypes.INTEGER({ length: 12 }),
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
  });
}
