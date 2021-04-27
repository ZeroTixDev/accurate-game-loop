"use strict";
var Loop = require('./index.ts');
// some tests
var update = function () { };
var loop = new Loop(update, 5, { log: true }).start();
