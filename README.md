# Accurate Game Loop
A library for nodejs game loops (not meant for browser), this package is pretty much the most accurate you can get with nodejs
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
# Options:
```ts
new Loop(
    update,
    timesPerSecond,
    {...options}
)
```
## Logs
#### This automatically enables every type of log internally (Useful for debug)
### Implementation:
```ts
new Loop(
    update,
    timesPerSecond,
    { logs: true }
)
```
### Example:
![Screenshot](https://cdn.discordapp.com/attachments/834833750948970506/838566696834301952/unknown.png)
## Delta Log
#### This automatically logs the time differences between the update calls
### Implementation:
```ts
new Loop(
    update,
    timesPerSecond,
    { delta_log: true }
)
```
### Example:
![Screenshot](https://media.discordapp.net/attachments/834833750948970506/838561596791848960/unknown.png)
## Difference Log
#### This automatically logs the time shifts that the code makes internally
### Implementation:
```ts
new Loop(
    update,
    timesPerSecond,
    { dif_log: true }
)
```
### Example:
![Screenshot](https://cdn.discordapp.com/attachments/834833750948970506/838566069941567488/unknown.png)
## Time Function
#### This allows you to specify the time function you want (expects it to return in nanoseconds)
### Example / Implementation:
```ts
new Loop(
    update,
    timesPerSecond,
    { time_fn: () => Date.now() * 1e6 }
)
```
### If you have any questions, you can make a github issue or dm me on discord at ZeroTix#6300   (I respond quick)
