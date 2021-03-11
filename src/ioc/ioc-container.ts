import controllerProvider from './providers/controller-provider';
import commonProvider from './providers/common-provider';
import serverProvider from './providers/server-provider';
import databaseProvider from './providers/database-provider';
import serviceProvider from './providers/service-provider';

export class Container {
  services: {
    [key: string]: any
  };

  providers: {
    [key: string]: (container: Container) => void
  };

  constructor() {
    this.services = {};
    this.providers = {};
  }

  get(name: string) {
    if (!(name in this.services)) {
      if (!this.providers[name]) {
        // eslint-disable-next-line no-console
        console.error(`No such service : ${name}`);
        process.exit(1);
      } else this.services[name] = this.providers[name](this);
    }

    return this.services[name];
  }

  service(name: string, cb: (container: Container) => void) {
    if (this.services[name]) this.services = {};
    this.providers[name] = cb;

    return this;
  }
}

export function createContainer() {
  const container = new Container();

  commonProvider(container);
  databaseProvider(container);
  serverProvider(container);
  controllerProvider(container);
  serviceProvider(container);

  return container;
}
