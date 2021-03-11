import express, { ErrorRequestHandler, Router } from 'express';
import http from 'http';
import path from 'path';

import logger from '../log';

const fileName = path.basename(__filename);

export default class HttpServer {
  private _listeningPort: number;
  private _app: express.Express;
  private _server?: http.Server;

  constructor(port: number, completeRouter: Router) {
    this._listeningPort = port;
    this._app = express();
    this._setupServer();
    this._setupControllers(completeRouter);
    this._setupMiddlewaresForErrorHandler();
  }

  get app() {
    return this._app;
  }

  /**
   * Starts Http Server
   * Installs listener listening and error event handlers
   */
  startServer() {
    this._server = http.createServer(this._app);
    this._server.listen(this._listeningPort, '0.0.0.0');
    this._server.on('error', this._onServerError);
    this._server.on('listening', () => logger.info(`${fileName} - Server is running`));
  }

  private _setupServer() {
    this._app.set('port', this._listeningPort);
    this._app.use(express.json({ limit: '2mb' }));
    this._app.use(express.urlencoded({ limit: '2mb', extended: true }));
  }

  private _onServerError(error: any) {
    switch (error.code) {
      case 'EACCES':
        logger.info(`${fileName} - ${this._listeningPort} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${fileName} - ${this._listeningPort} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private _setupControllers(completeRouter: Router) {
    this._app.use((request, response, next) => {
      response.header('Access-Control-Allow-Origin', '*');
      response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
    this._app.get('/health-check', (req, res) => res.end('healthy'));
    this._app.use('/', completeRouter);
  }

  private _setupMiddlewaresForErrorHandler() {
    this._app.use((req, res, next) => {
      logger.warn(`${fileName} - URL: ${req.originalUrl} not supported`);
      const err = new Error('Not Found');
      res.status(404);
      next(err);
    });

    if (this._app.get('env') === 'development') {
      this._app.use(((err, req, res, next) => {
        logger.error(`${fileName} - ${err.message}`);
        res.status(500);
        res.json({ code: 500, description: err.message });
      }) as ErrorRequestHandler);
    } else if (this._app.get('env') === 'production') {
      this._app.use(((err, req, res, next) => {
        logger.error(`${fileName} - ${err}`);
        res.status(500);
        res.json({ code: 500, description: 'Internal Server Error' });
      }) as ErrorRequestHandler);
    }
  }

  get listeningPort() {
    return this._listeningPort;
  }
}

module.exports = HttpServer;
