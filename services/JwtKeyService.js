/**
 * 更新JWT key相關之邏輯
 * @module services/JwtKeyService
 */

"use strict";

/**
 * 更新 JWT key
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/cust/jwt_key_create
 */
module.exports.updateJwtKey = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const JWTKeyRepository = require("../repositories/JWTKeyRepository");
		const crypto = require("crypto");
		const debug = require("debug")("KumonCheckINApi:JwtKeyService.updateJwtKey");

		let RandomStr1 = crypto.randomBytes(128).toString("base64").substr(0, 128);
		let RandomStr2 = crypto.randomBytes(128).toString("base64").substr(0, 128);
		debug(RandomStr1);
		debug(RandomStr2);

		await JWTKeyRepository.updateJwtKey(
			{ "JwtKey": 	RandomStr1, },
			{ "SystemType":	"KumonCheckINCustWeb" ,});

		await JWTKeyRepository.updateJwtKey(
			{ "JwtKey": 	RandomStr2, },
			{ "SystemType":	"KumonCheckINWeb" ,});
		
		res.send({	
			"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
		});
	}
	catch(err){ next(err); }
};

