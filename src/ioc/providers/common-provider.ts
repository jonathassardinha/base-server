import config from 'config';

import { Container } from '../ioc-container';
import logger from '../../../log';

function commonProvider(iocContainer: Container) {
  iocContainer.service('logger', () => logger);
  iocContainer.service('serverPort', () => config.get('serverPort'));
  iocContainer.service('jwtConfig', () => config.get('jwtConfig'));
}

export default commonProvider;
