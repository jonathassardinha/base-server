"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("config"));
var log_1 = __importDefault(require("../../../log"));
function commonProvider(iocContainer) {
    iocContainer.service('logger', function () { return log_1.default; });
    iocContainer.service('serverPort', function () { return config_1.default.get('serverPort'); });
}
exports.default = commonProvider;
