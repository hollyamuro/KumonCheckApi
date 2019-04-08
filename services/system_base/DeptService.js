/**
 * 部門資料相關之商業邏輯
 * @module services/system_base/DeptService
 * 
 */

"use strict";

/**
 * 取得所有部門資料
 * @param  {} req
 * @param  {} res
 * @see /api/staff/depts/read
 */
module.exports.selectDeptsInDepts = async (req, res, next) => {
	
	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const viewDeptRepository = require("../../repositories/system_base/ViewDeptRepository");
		const data = await viewDeptRepository.getDepts({});		
		
		res.send({	
			"code": (data.length === 0) ?
				messageHandler.infoHandler("INFO_NO_DATA"):
				messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": data, 
		});
	}
	catch(err){
		next(err);
	}	
};
