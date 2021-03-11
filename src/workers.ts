import cluster from 'cluster';
import { Router } from 'express';
import { Logger } from 'winston';
import path from 'path';

import HttpServer from './http-server';

const fileName = path.basename(__filename);
const numCPUs = require('os').cpus().length;

const map: {
  [key: string]: number
} = {};

function forkWorker(workerId: number) {
  const worker = cluster.fork({
    worker_id: workerId,
  });
  map[worker.id] = workerId;
}

export default function createWorkers(
  serverPort: number,
  router: Router,
  logger: Logger,
) {
  if (cluster.isMaster) {
    // fork worker threads
    for (let iWorker = 0; iWorker < numCPUs; iWorker += 1) {
      forkWorker(iWorker + 1);
    }

    cluster.on('online', () => { });

    cluster.on('listening', () => { });

    cluster.on('exit', (worker) => {
      const oldWorkerId = map[worker.id];
      delete map[worker.id];
      forkWorker(oldWorkerId);
    });

    Object.keys(cluster.workers).forEach((id) => {
      cluster.workers[id]?.on('message', (msg) => {
        cluster.workers[msg.id]?.send(msg);
      });
    });
  } else {
    logger.info(`${fileName} - Worker # ${process.env.worker_id}`);
    new HttpServer(serverPort, router).startServer();
  }
}
