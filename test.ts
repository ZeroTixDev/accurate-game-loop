const Loop = require('./index.ts');

const loop = new Loop(update, 5, { logs: true }).start();

function sleep(duration: number): void {
	const start = loop.now_ms();
	while (loop.now_ms() < start + duration) {
		;
	}
}
function update() {
	// do something useful
}
