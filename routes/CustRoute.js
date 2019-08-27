/**
 * 客戶用路由
 * @module routes/CustRoute
 */

"use strict";

/**
 * 客戶帳戶驗證、密碼設定等等路由
 * @param  {} app
 */
module.exports = (app) => {
	const CustAccountService = require("../services/CustAccountService");
	app.route("/api/cust/login").post(CustAccountService.login);
	app.route("/api/cust/jwtverify").post(CustAccountService.jwtverify);
	app.route("/api/cust/matching").post(CustAccountService.matching);
	app.route("/api/cust/verify").post(CustAccountService.verify);
	app.route("/api/cust/reset_password").post(CustAccountService.resetpassword);
	app.route("/api/cust/verify_password").post(CustAccountService.verifypassword);
	app.route("/api/cust/url_check").post(CustAccountService.url_check);

	const KumonCheckINCustWebService = require("../services/KumonCheckInService");
	app.route("/api/cust/dashboard").post(KumonCheckINCustWebService.getDashboard);
	app.route("/api/cust/KumonCheckIN/position").post(KumonCheckINCustWebService.getKumonCheckINPosition);
	app.route("/api/cust/KumonCheckIN/charge_off_history").post(KumonCheckINCustWebService.getKumonCheckINChargeOffHistory);
	app.route("/api/cust/KumonCheckIN/not_charge_off_history").post(KumonCheckINCustWebService.getKumonCheckINNotChargeOffHistory);
	app.route("/api/cust/KumonCheckIN/statement_report").post(KumonCheckINCustWebService.getStatementReport);

	const KumonCheckINBankWebService = require("../services/KumonCheckInWebService")
	app.route("/api/bank/KumonCheckIN/safekeeping/holding").post(KumonCheckINBankWebService.getSafekeepingHolding);
	app.route("/api/bank/KumonCheckIN/safekeeping/balance").post(KumonCheckINBankWebService.getSafekeepingBalance);

	//const JwtKeyService = require("../services/JwtKeyService");
	//app.route("/api/cust/jwt_key_create").post(JwtKeyService.updateJwtKey);
	
};
