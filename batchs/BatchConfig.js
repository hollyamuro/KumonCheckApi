/**
 * batch時間表
 * @module batchs/BatchConfig
 */


// time format:
// # ┌────────────── second (optional)
// # │ ┌──────────── minute
// # │ │ ┌────────── hour
// # │ │ │ ┌──────── day of month
// # │ │ │ │ ┌────── month
// # │ │ │ │ │ ┌──── day of week
// # │ │ │ │ │ │
// # │ │ │ │ │ │
// # * * * * * *

module.exports = [
	// name should equal module in batchs
	// time is the execution time accroding to above format
	{ name: "S001C001F001_ImportCustList", time: "0 0 8 * * *" },
	{ name: "UpdateJWTKey", time: "0 1 8 * * *" },
];
