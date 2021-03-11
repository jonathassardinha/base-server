import { BuildOptions, Model } from 'sequelize';

export type StaticModel<T> = typeof Model & {
  new(values?: object, options?: BuildOptions): T;
}
