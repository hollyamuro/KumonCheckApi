/**
 * CustGroups 相關之商業邏輯
 * @module services/CustGroupService
 */
"use strict";

/**
 * 取所有客戶群組
 * @param  {} req
 * @param  {} res
 * @see /api/staff/cust_groups/read
 */
module.exports.selectAllCustGroups = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupRepository = require("../repositories/CustGroupRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));

		// setup attributes and conditions
		let conditions = {};
		let attributes = [
			[ "Id", "cg_id", ],
			[ "Name", "cg_name", ],
			[ "Description", "cg_description", ],
			[ "Role", "cg_role", ],
			[ "Product", "cg_product", ],
		];

		// get data
		const data = await custGroupRepository.getCustGroups(attributes, conditions);		
		
		res.send({	
			"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": data, 
		});
	}
	catch(err){
		next(err);
	}
};

/**
 * 新增客戶群組
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_groups/create
 */
module.exports.insertCustGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupRepository = require("../repositories/CustGroupRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// insert data
			await custGroupRepository.createCustGroup({
				"Name":         req.body.data.cg_name,
				"Description":  req.body.data.cg_description,
				"Role":         req.body.data.cg_role,
				"Product":		req.body.data.cg_product,
			});
			
			res.send({ 	
				"code": messageHandler.infoHandler("INFO_CREATE_DATA_SUCCESS"), 
				"data": [], 
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch(err){
		next(err);
	}
};

/**
 * 刪除客戶群組
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_groups/delete
 */
module.exports.deleteCustGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupRepository = require("../repositories/CustGroupRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cg_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check group existed
			const isExisted = await custGroupRepository.isCustGroupsExisted({"Id" : req.body.data.cg_id});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete data
			await custGroupRepository.destroyCustGroup({"Id" : req.body.data.cg_id});
			
			res.send({ 	
				"code": messageHandler.infoHandler("INFO_DELETE_DATA_SUCCESS"), 
				"data": [], 
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch(err){ next(err); }
};

/**
 * 更新客戶群組
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_groups/update
 */
module.exports.updateCustGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupRepository = require("../repositories/CustGroupRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cg_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check group existed
			const isExisted = await custGroupRepository.isCustGroupsExisted({"Id" : req.body.data.cg_id});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// update group
			await custGroupRepository.setCustGroup(
				{
					"Name":         req.body.data.cg_name,
					"Description":  req.body.data.cg_description,
					"Role":         req.body.data.cg_role,
					"Product":		req.body.data.cg_product,
				},
				{ "Id": decodeURIComponent(req.body.data.cg_id) });

			res.send({ 	
				"code": messageHandler.infoHandler("INFO_UPDATE_DATA_SUCCESS"), 
				"data": [], 
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch(err){ next(err); }
};