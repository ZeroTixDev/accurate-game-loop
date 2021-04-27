
module.exports = function nano() {
	const hrtime = process.hrtime();
	return (+hrtime[0]) * 1e9 + (+hrtime[1]);
}