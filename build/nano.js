"use strict";
module.exports = function nano() {
    var hrtime = process.hrtime();
    return (+hrtime[0]) * 1e9 + (+hrtime[1]);
};
