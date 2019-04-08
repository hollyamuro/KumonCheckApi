/**
 * 系統共用路由
 * @module routes/ServiceRoute
 */

"use strict";

/**
 * 共用功能路由
 * @param  {} app
 */
module.exports = (app) => {
	const systemService = require("../services/system_base/SystemService");
	app.route("/").all(systemService.testService);    
	app.route("/version").all(systemService.version);    

	const holidayService = require("../services/system_base/HolidayService");
	app.route("/api/common/previous_work_date").all(holidayService.getPreviousWorkDay);    
};