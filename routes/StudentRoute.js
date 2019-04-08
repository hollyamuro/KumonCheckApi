/**
 * 客戶用路由
 * @module routes/StudentRoute
 */

"use strict";

/**
 * 客戶帳戶驗證、密碼設定等等路由
 * @param  {} app
 */
module.exports = (app) => {
	const StudentService = require("../services/StudentService");
	app.route("/api/student/checkin").post(StudentService.checkin);
	
};
