import dotenv from 'dotenv';

import { createContainer } from './src/ioc/ioc-container';

dotenv.config({
  path: `${__dirname}/.env`,
});

const container = createContainer();

container.get('workers');
