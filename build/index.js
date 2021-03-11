"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ioc_container_1 = require("./src/ioc/ioc-container");
var container = ioc_container_1.createContainer();
container.get('workers');
