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
	const CheckInService = require("../services/CheckInService");
	app.route("/api/service/checkin").post(CheckInService.checkin);
	app.route("/api/service/buildcheckin").post(CheckInService.buildcheckin);
	const holidayService = require("../services/system_base/HolidayService");
	app.route("/api/common/previous_work_date").all(holidayService.getPreviousWorkDay);    
};