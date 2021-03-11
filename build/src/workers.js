"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cluster_1 = __importDefault(require("cluster"));
var http_server_1 = __importDefault(require("./http-server"));
var numCPUs = require('os').cpus().length;
var map = {};
function forkWorker(workerId) {
    var worker = cluster_1.default.fork({
        worker_id: workerId,
    });
    map[worker.id] = workerId;
}
function createWorkers(serverPort, router, logger) {
    if (cluster_1.default.isMaster) {
        // fork worker threads
        for (var iWorker = 0; iWorker < numCPUs; iWorker += 1) {
            forkWorker(iWorker + 1);
        }
        cluster_1.default.on('online', function () { });
        cluster_1.default.on('listening', function () { });
        cluster_1.default.on('exit', function (worker) {
            var oldWorkerId = map[worker.id];
            delete map[worker.id];
            forkWorker(oldWorkerId);
        });
        Object.keys(cluster_1.default.workers).forEach(function (id) {
            var _a;
            (_a = cluster_1.default.workers[id]) === null || _a === void 0 ? void 0 : _a.on('message', function (msg) {
                var _a;
                (_a = cluster_1.default.workers[msg.id]) === null || _a === void 0 ? void 0 : _a.send(msg);
            });
        });
    }
    else {
        logger.info(module.filename + " Worker # " + process.env.worker_id);
        new http_server_1.default(serverPort, router).startServer();
    }
}
exports.default = createWorkers;
