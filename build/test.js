"use strict";
var Loop = require('./index.ts');
var loop = new Loop(update, 5, { logs: true }).start();
function sleep(duration) {
    var start = loop.now_ms();
    while (loop.now_ms() < start + duration) {
        ;
    }
}
function update() {
    // do something useful
}
