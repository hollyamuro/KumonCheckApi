/**
 * Group_Permissions 相關之商業邏輯
 * @module services/system_base/GroupPermissionService
 */

"use strict";

/**
 * 取得群組功能
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/group_permission/delete
 */
module.exports.getAllGroupPermissions = async (req, res, next) => {
	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupPermissionRepository = require("../../repositories/system_base/GroupPermissionRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// setup attributes and conditions
			let conditions = { "Group_Id": req.body.data.group_id };
			let attributes = [
				[ "Group_Id", "gp_group_id", ],
				[ "System_Id", "gp_system_id", ],
				[ "Directory_Id", "gp_directory_id", ],
				[ "Function_Id", "gp_function_id", ],
				[ "Auth", "gp_auth", ],
			];

			// get data
			const data = await groupPermissionRepository.getGroupPermissions(attributes, conditions);		
			
			//format data
			let obj = {};
			for(let i=0; i<data.length; i++){
				let key = data[i].gp_group_id + data[i].gp_system_id + data[i].gp_directory_id + data[i].gp_function_id;

				if(!obj.hasOwnProperty(key)){
					obj[key] = {
						"gp_group_id": data[i].gp_group_id,
						"gp_system_id": data[i].gp_system_id,
						"gp_directory_id": data[i].gp_directory_id,
						"gp_function_id": data[i].gp_function_id,
						"gp_auth": [],
					};
				}
				obj[key].gp_auth.push( data[i].gp_auth);
			}
			
			res.send({	
				"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": Object.values(obj), 
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch(err){ next(err); }
};

/**
 * 新增某群組內之權限
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/group_permission/create
 */
module.exports.insertGroupPermissions = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupPermissionRepository = require("../../repositories/system_base/GroupPermissionRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_group") || req.body.data.group_permission_group === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_sys") || req.body.data.group_permission_sys === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_dir") || req.body.data.group_permission_dir === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_fun") || req.body.data.group_permission_fun === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_auth") || req.body.data.group_permission_auth.length === 0 || req.body.data.group_permission_auth[0] === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check existed and vaild
			const isExisted = await groupPermissionRepository.isGroupPermissionsExisted({
				"Group_Id": req.body.data.group_permission_group,
				"System_Id": req.body.data.group_permission_sys,
				"Directory_Id": req.body.data.group_permission_dir,
				"Function_Id": req.body.data.group_permission_fun,
				"Auth": req.body.data.group_permission_auth,
			});
			if(isExisted === true) throw(new Error("ERROR_DUPLICATE_DATA"));

			// perpare permission 
			let permissionList = [];
			for(let i=0; i< req.body.data.group_permission_auth.length; i++){
				permissionList.push({
					"Group_Id": req.body.data.group_permission_group,
					"System_Id": req.body.data.group_permission_sys,
					"Directory_Id": req.body.data.group_permission_dir,
					"Function_Id": req.body.data.group_permission_fun,
					"Auth": req.body.data.group_permission_auth[i],
				});
			}

			// insert data
			await groupPermissionRepository.createGroupPermissions(permissionList);
			
			res.send({ 	
				"code": messageHandler.infoHandler("INFO_CREATE_DATA_SUCCESS"), 
				"data": [], 
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch(err){ next(err); }
};

/**
 * 刪除某群組內之權限
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/group_permission/delete
 */
module.exports.deleteGroupPermissions = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const groupPermissionRepository = require("../../repositories/system_base/GroupPermissionRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_group") || req.body.data.group_permission_group === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_sys") || req.body.data.group_permission_sys === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_dir") || req.body.data.group_permission_dir === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_fun") || req.body.data.group_permission_fun === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("group_permission_auth")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check existed and vaild
			let conditions = {
				"Group_Id": req.body.data.group_permission_group,
				"System_Id": req.body.data.group_permission_sys,
				"Directory_Id": req.body.data.group_permission_dir,
				"Function_Id": req.body.data.group_permission_fun,
			};
			if(req.body.data.hasOwnProperty("group_permission_auth") && req.body.data.group_permission_auth !== "") 
				conditions.Auth = req.body.data.group_permission_auth;

			const isExisted = await groupPermissionRepository.isGroupPermissionsExisted(conditions);
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete data
			await groupPermissionRepository.destroyGroupPermissions(conditions);
			
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