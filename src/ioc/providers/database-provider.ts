import config from 'config';

import { Container } from '../ioc-container';
import { DatabaseFactory, DBConfig } from '../../database/database-factory';
import { UserFactory } from '../../database/models/User';
import { BaseFactory } from '../../database/models/Base';

function commonProvider(iocContainer: Container) {
  iocContainer.service('dbConfig', () => config.get('dbConfig') as DBConfig);
  iocContainer.service('database', (container: Container) => new DatabaseFactory(container.get('dbConfig')));
  iocContainer.service('userRepository', (container: Container) => UserFactory(container.get('database')));
  iocContainer.service('baseRepository', (container: Container) => BaseFactory(container.get('database')));
}

export default commonProvider;
