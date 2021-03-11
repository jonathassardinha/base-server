"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_controller_1 = __importDefault(require("../../webcontrollers/user-controller"));
function controllerProvider(iocContainer) {
    iocContainer.service('controllers', function (container) { return [
        new user_controller_1.default(container.get('router'), 'users'),
    ]; });
}
exports.default = controllerProvider;
