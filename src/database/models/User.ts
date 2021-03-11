import {
  Model, DataTypes,
} from 'sequelize';
import { DatabaseFactory } from '../database-factory';
import { StaticModel } from './StaticModel';

export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes { }
export class User extends Model<UserModel, UserAttributes> { }

export function UserFactory(database: DatabaseFactory): StaticModel<UserModel> {
  return database.db.define('User', {
    id: {
      type: DataTypes.INTEGER({ length: 12 }),
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
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
