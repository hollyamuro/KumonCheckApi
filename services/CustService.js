/**
 * Custs 相關之商業邏輯
 * @module services/CustService
 */

"use strict";

/**
 * 查詢客戶
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/custs/read
 */
module.exports.selectAllCusts = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custRepository = require("../repositories/CustRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		
		// setup attributes and conditions
		let conditions = {};

		// get data
		const data = await custRepository.getCustDetail(conditions);		
		
		res.send({	
			"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": data, 
		});
	}
	catch(err){ next(err); }
};

/**
 * 每日匯入最新客戶資料
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.importAllCusts = async (req, res, next) => {
	try
	{
		const axios = require("axios");
		const messageHandler = require("../helper/MessageHandler");
		const custRepository = require("../repositories/CustRepository");
		const config = require("../Config");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
        
		// get data from api
		const local =   config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" + 
                        config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" + 
                        config[process.env.NODE_ENV].KumonCheckINBackend.port;
		const custs = await axios.post(local + "/apis/custmoer/getlist",{});
        
		// delete old data
		await custRepository.destroyCusts({});
        
		// insert new data
		await custRepository.createCusts(custs.data.data);

		res.send({	
			"code": messageHandler.infoHandler("INFO_IMPORT_DATA_SUCCESS"),
			"data": [], 
		});
	}
	catch(err){ next(err); }
};