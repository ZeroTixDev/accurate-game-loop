const nano = require('./nano.ts');

interface Option {
	log?: boolean;
	time_fn?: () => number;
}

module.exports = class Loop {
	_update: Function;
	_lastFrameTime: number;
	_running: boolean;
	_step: number;
	_deltas: Array<number>;
	constructor(update = () => {}, public _times: number = 10, public _option?: Option) {
		this._update = update;
		this._running = false;
		this._step = 1000 / this._times;
		this._lastFrameTime = this._time();
		this._deltas = Array<number>();
	}
	_ConvertSecondsToNano(sec: number): number {
		return sec * 1e9;
	}
	_ConvertNanoToSeconds(nano: number): number {
		return nano * (1 / 1e9);
	}
	_ConvertMsToNano(ms: number): number {
		return ms * 1e6;
	}
	_time(): number {
		return this._option?.time_fn?.() ?? nano();
	}
	start(): Loop {
		this._running = true;
		this._lastFrameTime = this._time();
		this._deltas = Array<number>();
		const expectedLength = this._ConvertMsToNano(this._step);
		const _interval = Math.max(Math.floor(this._step - 1), 16);
		const _this = this; // changes to _this will also happen on this

		let _target = this._time();

		function tick() {
			if (!_this._running) return;

			const now = _this._time();
			const delta = now - _this._lastFrameTime;

			if (_this._deltas.length >= 5) {
				_this._deltas.shift();
			}
			_this._deltas.push(delta);

			if (now <= _target) {
				return setImmediate(tick);
			}
			// to make sure its going forward in time
			_this._lastFrameTime = now;
			_target = now + expectedLength;
			// run the update!!
			_this._update(_this._ConvertNanoToSeconds(delta)); // (delta in seconds)
			if (_this._option?.log)
				console.log(`${_this._ConvertNanoToSeconds(delta) * 1000} ms`);

			const remaining = _target - _this._time();
			if (remaining > expectedLength) {
				// if update take too long,
				return setTimeout(tick, _interval);
			} else {
				// to make it very precise, runs next event loop
				return setImmediate(tick);
			}
		}
		// this will cause the first tick to be "late"
		setTimeout(tick, _interval);
		return this;
	}
	stop() {
		this._running = false;
	}
}
