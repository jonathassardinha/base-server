"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContainer = exports.Container = void 0;
var controller_provider_1 = __importDefault(require("./providers/controller-provider"));
var common_provider_1 = __importDefault(require("./providers/common-provider"));
var server_provider_1 = __importDefault(require("./providers/server-provider"));
var Container = /** @class */ (function () {
    function Container() {
        this.services = {};
        this.providers = {};
    }
    Container.prototype.get = function (name) {
        if (!(name in this.services)) {
            if (!this.providers[name]) {
                console.error("No such service : " + name);
                process.exit(1);
            }
            else
                this.services[name] = this.providers[name](this);
        }
        return this.services[name];
    };
    Container.prototype.service = function (name, cb) {
        this.providers[name] = cb;
        return this;
    };
    return Container;
}());
exports.Container = Container;
function createContainer() {
    var container = new Container();
    common_provider_1.default(container);
    server_provider_1.default(container);
    controller_provider_1.default(container);
    return container;
}
exports.createContainer = createContainer;
