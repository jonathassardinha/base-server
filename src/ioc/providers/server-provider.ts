import express from 'express';

import { Container } from '../ioc-container';
import createWorkers from '../../workers';

function serverProvider(iocContainer: Container) {
  iocContainer.service('router', () => express.Router());
  iocContainer.service('completeRouter', (container: Container) => {
    container.get('controllers');
    return container.get('router');
  });

  iocContainer.service('workers', (container) => createWorkers(
    container.get('serverPort'),
    container.get('completeRouter'),
    container.get('logger'),
  ));
}

export default serverProvider;
