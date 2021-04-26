# Accurate Game Loop
A library for nodejs game loops (not meant for browser)
# Install
```bash
npm install accurate-game-loop
```
# Usage / Documentation
```ts
const Loop = require('accurate-game-loop');
```
## Creating a loop
```ts
const timesPerSecond = 60;
const update = () => {
    // do something smart
};
const loop = new Loop(update, timesPerSecond);
```
## Starting a loop
```ts
loop.start();
// or
const loop = new Loop(...params).start();
```
## Stopping a loop
```ts
loop.stop();
```
## Options:
```ts
interface Option {
    log?: boolean;
    time_fn?: () => number;
}

// Example use:
new Loop(
    update,
    timesPerSecond,
    { log: true },
);
```
