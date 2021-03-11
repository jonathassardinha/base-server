"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var log_1 = __importDefault(require("../log"));
var HttpServer = /** @class */ (function () {
    function HttpServer(port, completeRouter) {
        this._listeningPort = port;
        this._app = express_1.default();
        this._setupServer();
        this._setupControllers(completeRouter);
        this._setupMiddlewaresForErrorHandler();
    }
    /**
     * Starts Http Server
     * Installs listener listening and error event handlers
     */
    HttpServer.prototype.startServer = function () {
        this._server = http_1.default.createServer(this._app);
        this._server.listen(this._listeningPort, '0.0.0.0');
        this._server.on('error', this._onServerError);
        this._server.on('listening', function () { return log_1.default.info('Server is running'); });
    };
    HttpServer.prototype._setupServer = function () {
        this._app.set('port', this._listeningPort);
        this._app.use(express_1.default.json({ limit: '2mb' }));
        this._app.use(express_1.default.urlencoded({ limit: '2mb', extended: true }));
    };
    HttpServer.prototype._onServerError = function (error) {
        switch (error.code) {
            case 'EACCES':
                log_1.default.info(this._listeningPort + " requires elevated privileges");
                process.exit(1);
                break;
            case 'EADDRINUSE':
                log_1.default.error(this._listeningPort + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    };
    HttpServer.prototype._setupControllers = function (completeRouter) {
        this._app.use(function (request, response, next) {
            response.header('Access-Control-Allow-Origin', '*');
            response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            next();
        });
        this._app.get('/health-check', function (req, res) { return res.end('healthy'); });
        this._app.use('/', completeRouter);
    };
    HttpServer.prototype._setupMiddlewaresForErrorHandler = function () {
        this._app.use(function (req, res, next) {
            log_1.default.warn(req.headers.origin);
            log_1.default.warn("URL: " + req.originalUrl + "\n        Requester IP: " + req.headers['x-forwarded-for'] + " hitting port: " + req.headers['x-forwarded-port'] + "\n        with protocol: " + req.headers['x-forwarded-proto'] + "\n        ");
            var err = new Error('Not Found');
            res.status(404);
            next(err);
        });
        if (this._app.get('env') === 'development') {
            this._app.use((function (err, req, res, next) {
                log_1.default.error(err);
                res.status(err.status || 500);
                res.json({ code: err.code, description: err });
            }));
        }
        else if (this._app.get('env') === 'production') {
            this._app.use((function (err, req, res, next) {
                log_1.default.error(err);
                res.status(err.status || 500);
                res.json({ code: err.code, description: err.message });
            }));
        }
    };
    Object.defineProperty(HttpServer.prototype, "listeningPort", {
        get: function () {
            return this._listeningPort;
        },
        enumerable: false,
        configurable: true
    });
    return HttpServer;
}());
exports.default = HttpServer;
module.exports = HttpServer;
