/**
 * forever對外接口(npm用)
 * @module controllers/CommonMethod
 */

"use strict";

/**
 *  停止在forever下運行的服務(對外接口)
 * @param {Array.<String>} args
 */
const runCI = (args) => {

	const debug = require("debug")("KumonCheckINApi:CICommand.runCI");
	const ciMethod = require("./CommonMethod");

	if (args[0]) {
		if (args[0].indexOf("forever") !== -1) {
			debug("ci method kill forever pid");
			ciMethod.killForeverPid(args[1]);
		}
	}
};

runCI(process.argv.slice(2));