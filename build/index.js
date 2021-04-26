"use strict";
var Present = require('present');
module.exports = /** @class */ (function () {
    function Loop(update, _times, _option) {
        if (update === void 0) { update = function () { }; }
        if (_times === void 0) { _times = 10; }
        this._times = _times;
        this._option = _option;
        this._update = update;
        this._running = false;
        this._step = 1000 / this._times;
        this._lastFrameTime = Present();
        this._deltas = Array();
    }
    Loop.prototype._time = function () {
        var _a, _b, _c;
        return (_c = (_b = (_a = this._option) === null || _a === void 0 ? void 0 : _a.time_fn) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : Present();
    };
    Loop.prototype.start = function () {
        this._running = true;
        this._lastFrameTime = this._time();
        this._deltas = Array();
        var _this = this; // changes to _this will also happen on this
        function tick() {
            var _a;
            if (!_this._running)
                return;
            _this._update();
            var now = _this._time();
            var delta = now - _this._lastFrameTime;
            _this._lastFrameTime = now;
            if (_this._deltas.length >= _this._times / 2) {
                _this._deltas.shift();
            }
            _this._deltas.push(delta);
            var average = _this._deltas
                .reduce(function (a, b) { return a + b; }, 0) / (_this._deltas.length || 1);
            var drift = average * 1.05 - _this._step;
            if ((_a = _this._option) === null || _a === void 0 ? void 0 : _a.log)
                console.log(Math.round(delta) + " ms");
            setTimeout(tick, _this._step - drift);
        }
        setTimeout(tick, _this._step);
        return this;
    };
    Loop.prototype.stop = function () {
        this._running = false;
    };
    return Loop;
}());
/* without compensating drift, the time is ahead of the _step rate by an arbitary number */
/* with drift compensation, the time is more accurate to the _step rate */ 
