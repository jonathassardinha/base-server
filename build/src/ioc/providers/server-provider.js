"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var workers_1 = __importDefault(require("../../workers"));
function serverProvider(iocContainer) {
    iocContainer.service('router', function () { return express_1.default.Router(); });
    iocContainer.service('completeRouter', function (container) {
        container.get('controllers');
        return container.get('router');
    });
    iocContainer.service('workers', function (container) { return workers_1.default(container.get('serverPort'), container.get('completeRouter'), container.get('logger')); });
}
exports.default = serverProvider;
