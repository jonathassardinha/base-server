import { Container } from '../ioc-container';
import BaseService from '../../services/base-service';
import AuthService from '../../services/auth-service';

function controllerProvider(iocContainer: Container) {
  iocContainer.service('baseService', (container: Container) => new BaseService(
    container.get('baseRepository'),
    container.get('logger'),
  ));

  iocContainer.service('authService', (container: Container) => new AuthService(
    container.get('userRepository'),
    container.get('logger'),
    container.get('jwtConfig'),
  ));
}

export default controllerProvider;
