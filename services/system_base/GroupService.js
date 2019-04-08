/**
 * Groups 相關之商業邏輯
 * @module services/system_base/GroupService
 */
"use strict";

/**
 * 取所有群組
 * @param  {} req
 * @param  {} res
 * @see /api/staff/groups/read
 */
module.exports.selectAllGroups = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupRepository = require("../../repositories/system_base/GroupRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));

		// setup attributes and conditions
		let conditions = {};
		let attributes = [
			[ "Id", "g_id", ],
			[ "Name", "g_name", ],
			[ "Description", "g_description", ],
			[ "Role", "g_role", ],
			[ "Product", "g_product", ],
		];

		// get data
		const data = await groupRepository.getGroups(attributes, conditions);		
		
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
 * 新增群組
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/groups/create
 */
module.exports.insertGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupRepository = require("../../repositories/system_base/GroupRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// insert data
			await groupRepository.createGroup({
				"Name":         req.body.data.g_name,
				"Description":  req.body.data.g_description,
				"Role":         req.body.data.g_role,
				"Product":		req.body.data.g_product,
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
 * 刪除群組
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/groups/delete
 */
module.exports.deleteGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupRepository = require("../../repositories/system_base/GroupRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("g_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check group existed
			const isExisted = await groupRepository.isGroupsExisted({"Id" : req.body.data.g_id});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete data
			await groupRepository.destroyGroup({"Id" : req.body.data.g_id});
			
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
 * 更新群組
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/groups/update
 */
module.exports.updateGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupRepository = require("../../repositories/system_base/GroupRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("g_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check group existed
			const isExisted = await groupRepository.isGroupsExisted({"Id" : req.body.data.g_id});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// update group
			await groupRepository.setGroup(
				{
					"Name": 		req.body.data.g_name,
					"Description": 	req.body.data.g_description,
					"Role": 		req.body.data.g_role,
					"Product":		req.body.data.g_product,
				},
				{ "Id": decodeURIComponent(req.body.data.g_id) });

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