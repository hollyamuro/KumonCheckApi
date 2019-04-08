/**
 * 系統基礎之商業邏輯
 * @module services/system_base/SystemService
 */

"use strict";

/**
  * 測試服務是否正常運作
  * @param  {} req
  * @param  {} res
  * @param  {} next
  * @see /
  */
module.exports.testService = (req, res, next) => {

	const debug = require("debug")("KumonCheckINApi:SystemService.testService");

	try{
		const messageHandler = require("../../helper/MessageHandler");
		res.send({
			"code" : messageHandler.infoHandler("INFO_SERVICE_ALIVE"),
			"data": "",
		});
	}	
	catch(err){
		debug(err.stack);
		next(err);
	}
};

/**
 * 取的系統版本
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.version = (req, res, next) => {

	const config = require("../../Config");

	try{
		const messageHandler = require("../../helper/MessageHandler");
		res.send({
			"code" : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": config[process.env.NODE_ENV].version,
		});
	}	
	catch(err){
		next(err);
	}
};