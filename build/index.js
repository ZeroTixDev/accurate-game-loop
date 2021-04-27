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
    Loop.prototype._ConvertMsToNano = function (ms) {
        return ms * 1e6;
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
        var _this = this; // changes to _this will also happen on this
        var _target = this._time();
        function tick() {
            var _a;
            if (!_this._running)
                return;
            var now = _this._time();
            var delta = now - _this._lastFrameTime;
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
            if ((_a = _this._option) === null || _a === void 0 ? void 0 : _a.log)
                console.log(_this._ConvertNanoToSeconds(delta) * 1000 + " ms");
            var remaining = _target - _this._time();
            if (remaining > expectedLength) {
                // if update take too long,
                return setTimeout(tick, _interval);
            }
            else {
                // to make it very precise, runs next event loop
                return setImmediate(tick);
            }
        }
        // this will cause the first tick to be "late"
        setTimeout(tick, _interval);
        return this;
    };
    Loop.prototype.stop = function () {
        this._running = false;
    };
    return Loop;
}());
