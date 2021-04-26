const Present = require('present');

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
		this._lastFrameTime = Present();
		this._deltas = Array<number>();
	}
	_time(): number {
		return this._option?.time_fn?.() ?? Present();
	}
	start(): Loop {
		this._running = true;
		this._lastFrameTime = this._time();
		this._deltas = Array<number>();
		const _this = this; // changes to _this will also happen on this
		function tick() {
			if (!_this._running) return;
			_this._update();

			const now = _this._time();
			const delta = now - _this._lastFrameTime;
			_this._lastFrameTime = now;
			if (_this._deltas.length >= _this._times / 2) {
				_this._deltas.shift();
			}
			_this._deltas.push(delta);
			const average = _this._deltas
				.reduce((a, b) => a + b, 0) / (_this._deltas.length || 1);
			const drift = average * 1.05 - _this._step;

			if (_this._option?.log) console.log(`${Math.round(delta)} ms`);

			setTimeout(tick, _this._step - drift);
		}
		setTimeout(tick, _this._step);
		return this;
	}
	stop() {
		this._running = false;
	}
}

/* without compensating drift, the time is ahead of the _step rate by an arbitary number */
/* with drift compensation, the time is more accurate to the _step rate */