import Sequelize from 'sequelize';

export interface DBConfig {
  database: string;
  user: string;
  password: string;
  host: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | undefined;
  connectionLimit: number;
}

export class DatabaseFactory {
  db: Sequelize.Sequelize;

  constructor(dbConfig: DBConfig) {
    this.db = new Sequelize.Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      pool: { max: dbConfig.connectionLimit },
    });
  }
}
