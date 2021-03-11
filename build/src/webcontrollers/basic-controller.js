"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicController = /** @class */ (function () {
    function BasicController(router, baseRoute) {
        router.get("/" + baseRoute, function (req, res) { return res.end('Route up'); });
    }
    return BasicController;
}());
exports.default = BasicController;
