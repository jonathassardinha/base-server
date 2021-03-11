import { Container } from '../ioc-container';
import BaseController from '../../controllers/base-controller';
import AuthMiddleware from '../../middlewares/auth-middleware';
import BaseMiddleware from '../../middlewares/base-middleware';
import AuthController from '../../controllers/auth-controller';

function controllerProvider(iocContainer: Container) {
  iocContainer.service('baseMiddleware', (container: Container) => new BaseMiddleware(container.get('logger')));
  iocContainer.service('authMiddleware', (container: Container) => new AuthMiddleware(
    container.get('authService'),
    container.get('logger'),
  ));

  iocContainer.service('controllers', (container: Container) => [
    new BaseController(
      container.get('router'),
      'base',
      container.get('logger'),
      container.get('authMiddleware'),
      container.get('baseMiddleware'),
      container.get('authService'),
    ),
    new AuthController(
      container.get('router'),
      'auth',
      container.get('logger'),
      container.get('authMiddleware'),
      container.get('authService'),
    ),
  ]);
}

export default controllerProvider;
