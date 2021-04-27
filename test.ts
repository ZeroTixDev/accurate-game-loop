const Loop = require('./index.ts');


// some tests
const update = () => {};
const loop = new Loop(update, 5, { log: true }).start();
