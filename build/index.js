"use strict";
module.exports = /** @class */ (function () {
    function Loop(update, _times, _option) {
        if (update === void 0) { update = function () { }; }
        if (_times === void 0) { _times = 10; }
        this._times = _times;
        this._option = _option;
        this._update = update;
        this._running = false;
        this._step = 1000 / this._times;
        this._lastFrameTime = this._time();
        this._deltas = Array();
    }
    Loop.prototype._nano = function () {
        var hrtime = process.hrtime();
        return (+hrtime[0]) * 1e9 + (+hrtime[1]);
    };
    Loop.prototype._ConvertSecondsToNano = function (sec) {
        return sec * 1e9;
    };
    Loop.prototype._ConvertNanoToSeconds = function (nano) {
        return nano * (1 / 1e9);
    };
    Loop.prototype._ConvertNanoToMs = function (nano) {
        return this._ConvertNanoToSeconds(nano) * 1000;
    };
    Loop.prototype._ConvertMsToNano = function (ms) {
        return ms * 1e6;
    };
    Loop.prototype.now_ms = function () {
        return this._ConvertNanoToMs(this._time());
    };
    Loop.prototype._time = function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = this._option) === null || _a === void 0 ? void 0 : _a.time_fn) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : this._nano();
    };
    Loop.prototype.start = function () {
        this._running = true;
        this._lastFrameTime = this._time();
        this._deltas = Array();
        var expectedLength = this._ConvertMsToNano(this._step);
        var _interval = Math.max(Math.floor(this._step - 1), 16);
        var jitterThreshold = 2; // 2 ms
        var maxDeltaLength = Math.round(((1 / this._step) * 1000) / 20); // lasts 0.2s
        var _this = this; // changes to _this will also happen on this
        var _target = this._time();
        function _tick() {
            var _a, _b, _c, _d;
            if (!_this._running)
                return;
            var now = _this._time();
            var delta = now - _this._lastFrameTime;
            if (now <= _target) {
                // we dont need to simulate yet!!
                return setImmediate(_tick);
            }
            // average out the delta!!
            if (_this._deltas.length >= maxDeltaLength) {
                _this._deltas.shift();
            }
            _this._deltas.push(delta);
            var averageDelta = _this._deltas
                .reduce(function (a, b) { return a + b; }, 0) / (_this._deltas.length || 1);
            // shift some values !!!
            _this._lastFrameTime = now;
            _target = now + expectedLength;
            if (_this._ConvertNanoToMs(Math.abs(expectedLength - averageDelta)) >= jitterThreshold) {
                // lets shift the target !!!! :D
                if (((_a = _this._option) === null || _a === void 0 ? void 0 : _a.logs) || ((_b = _this._option) === null || _b === void 0 ? void 0 : _b.dif_log)) {
                    console.log(_this._ConvertNanoToMs(expectedLength - averageDelta));
                }
                _target += expectedLength - averageDelta;
            }
            // run the update !!
            _this._update(_this._ConvertNanoToMs(delta) / 1000); // (delta in seconds)
            if (((_c = _this._option) === null || _c === void 0 ? void 0 : _c.logs) || ((_d = _this._option) === null || _d === void 0 ? void 0 : _d.delta_log)) {
                console.log(_this._ConvertNanoToMs(delta) + " ms");
            }
            var remaining = _target - _this._time();
            if (remaining > expectedLength) {
                // this shouldnt happen!
                return setTimeout(_tick, _interval);
            }
            else {
                // to make it very precise, runs next event loop !!
                return setImmediate(_tick);
            }
        }
        setTimeout(_tick, _interval);
        return this;
    };
    Loop.prototype.stop = function () {
        this._running = false;
        return this;
    };
    return Loop;
}());
