/**
 * Group_Users 相關之商業邏輯
 * @module services/system_base/GroupUserService
 */

"use strict";

/**
 * 取某群組中的使用者。
 * @param  {} req
 * @param  {} res
 * @see /api/staff/groups/read
 */
module.exports.selectUsersInGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupUserRepository = require("../../repositories/system_base/GroupUserRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// setup conditions
			let conditions = { "Group_Id": req.body.data.group_id, };
			
			// get data
			const data = await groupUserRepository.getGroupUsers(conditions);		
			
			res.send({	
				"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": data, 
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
 * 新增使用者至取某群組中。
 * @param  {} req
 * @param  {} res
 * @param  {} next
  */
module.exports.insertGroupUser = async (req, res, next) => {
	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupUserRepository = require("../../repositories/system_base/GroupUserRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_id") || req.body.data.group_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("user_id") || req.body.data.user_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check existed
			const isExisted = await groupUserRepository.isGroupUsersExisted({
				"User_Id": req.body.data.user_id,
				"Group_Id":  req.body.data.group_id,
			});
			if(isExisted === true) throw(new Error("ERROR_DUPLICATE_DATA"));
			
			// insert data
			await groupUserRepository.createGroupUser({
				"User_Id": req.body.data.user_id,
				"Group_Id":  req.body.data.group_id,
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
 * 刪除某群組中之使用者
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/groups/delete
 */
module.exports.deleteGroupUser = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupUserRepository = require("../../repositories/system_base/GroupUserRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_id") || req.body.data.group_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("user_id") || req.body.data.user_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check existed
			const isExisted = await groupUserRepository.isGroupUsersExisted({
				"User_Id": req.body.data.user_id,
				"Group_Id":  req.body.data.group_id,
			});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete data
			await groupUserRepository.destroyGroupUser({
				"User_Id": req.body.data.user_id,
				"Group_Id":  req.body.data.group_id,
			});
			
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