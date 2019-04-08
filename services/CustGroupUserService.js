/**
 * Cust_Group_Users 相關之商業邏輯
 * @module services/CustGroupUserService
 */

"use strict";

/**
 * 取某群組中的客戶。
 * @param  {} req
 * @param  {} res
 * @see /api/staff/cust_group_users/read
 */
module.exports.selectCustsInGroup = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupUserRepository = require("../repositories/CustGroupUserRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// setup conditions
			let conditions = { "Group_Id": req.body.data.cust_group_id, };
			
			// get data
			const data = await custGroupUserRepository.getCustGroupUsers(conditions);		
			
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
 * 新增客戶至取某群組中。
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_group_users/create
 */
module.exports.insertCustGroupUser = async (req, res, next) => {
	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupUserRepository = require("../repositories/CustGroupUserRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_id") || req.body.data.cust_group_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_account_no") || req.body.data.cust_account_no === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_sino_account")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check existed
			const isExisted = await custGroupUserRepository.isCustGroupUsersExisted({
				"Account_No": 	req.body.data.cust_account_no,
				"Sino_Account": req.body.data.cust_sino_account,
				"Group_Id":  	req.body.data.cust_group_id,
			});
			if(isExisted === true) throw(new Error("ERROR_DUPLICATE_DATA"));
			
			// insert data
			await custGroupUserRepository.createCustGroupUser({
				"Account_No": 	req.body.data.cust_account_no,
				"Sino_Account": req.body.data.cust_sino_account,
				"Group_Id":  	req.body.data.cust_group_id,
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
 * 刪除某群組中之客戶
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_group_users/delete
 */
module.exports.deleteCustGroupUser = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupUserRepository = require("../repositories/CustGroupUserRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_id") || req.body.data.cust_group_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_account_no") || req.body.data.cust_account_no === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_sino_account")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check existed
			const isExisted = await custGroupUserRepository.isCustGroupUsersExisted({
				"Account_No": 	req.body.data.cust_account_no,
				"Sino_Account": req.body.data.cust_sino_account,
				"Group_Id":  	req.body.data.cust_group_id,
			});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete data
			await custGroupUserRepository.destroyCustGroupUser({
				"Account_No": 	req.body.data.cust_account_no,
				"Sino_Account": req.body.data.cust_sino_account,
				"Group_Id":  	req.body.data.cust_group_id,
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