/**
 * Group_Permissions 相關之商業邏輯
 * @module services/CustGroupPermissionService
 */

"use strict";

/**
 * 取得群組功能
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_group_permissions/delete
 */
module.exports.getAllCustGroupPermissions = async (req, res, next) => {
	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupPermissionRepository = require("../repositories/CustGroupPermissionRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));

		// setup attributes and conditions
		let conditions = { "Group_Id": req.body.data.cust_group_id };
		let attributes = [
			[ "Group_Id", "cgp_group_id", ],
			[ "System_Id", "cgp_system_id", ],
			[ "Directory_Id", "cgp_directory_id", ],
			[ "Function_Id", "cgp_function_id", ],
			[ "Auth", "cgp_auth", ],
		];

		// get data
		const data = await custGroupPermissionRepository.getCustGroupPermissions(attributes, conditions);		
		
		//format data
		let obj = {};
		for(let i=0; i < data.length; i++){
			let key = data[i].cgp_group_id + data[i].cgp_system_id + data[i].cgp_directory_id + data[i].cgp_function_id;

			if(!obj.hasOwnProperty(key)){
				obj[key] = {
					"cgp_group_id": data[i].cgp_group_id,
					"cgp_system_id": data[i].cgp_system_id,
					"cgp_directory_id": data[i].cgp_directory_id,
					"cgp_function_id": data[i].cgp_function_id,
					"cgp_auth": [],
				};
			}
			obj[key].cgp_auth.push( data[i].cgp_auth);
		}

		res.send({	
			"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": Object.values(obj), 
		});
	}
	catch(err){ next(err); }
};

/**
 * 新增某群組內之權限
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_group_permissions/create
 */
module.exports.insertCustGroupPermissions = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupPermissionRepository = require("../repositories/CustGroupPermissionRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_group") || 
			req.body.data.cust_group_permission_group === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_sys") || 
			req.body.data.cust_group_permission_sys === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_dir") || 
			req.body.data.cust_group_permission_dir === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_fun") || 
			req.body.data.cust_group_permission_fun === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_auth") || 
			req.body.data.cust_group_permission_auth.length === 0 || 
			req.body.data.cust_group_permission_auth[0] === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check existed
			const isExisted = await custGroupPermissionRepository.isCustGroupPermissionsExisted({
				"Group_Id": req.body.data.cust_group_permission_group,
				"System_Id": req.body.data.cust_group_permission_sys,
				"Directory_Id": req.body.data.cust_group_permission_dir,
				"Function_Id": req.body.data.cust_group_permission_fun,
				"Auth": req.body.data.cust_group_permission_auth,
			});
			if(isExisted === true) throw(new Error("ERROR_DUPLICATE_DATA"));

			// perpare permission 
			let permissionList = [];
			for(let i=0; i< req.body.data.cust_group_permission_auth.length; i++){
				permissionList.push({
					"Group_Id": req.body.data.cust_group_permission_group,
					"System_Id": req.body.data.cust_group_permission_sys,
					"Directory_Id": req.body.data.cust_group_permission_dir,
					"Function_Id": req.body.data.cust_group_permission_fun,
					"Auth": req.body.data.cust_group_permission_auth[i],
				});
			}

			// insert data
			await custGroupPermissionRepository.createCustGroupPermissions(permissionList);
			
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
 * 刪除某群組內之權限，刪除單一權限需要auth欄位，否則全部刪除。
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/cust_group_permissions/delete
 */
module.exports.deleteCustGroupPermission = async (req, res, next) => {

	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const custGroupPermissionRepository = require("../repositories/CustGroupPermissionRepository");
		const utility = require("../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_group") || 
			req.body.data.cust_group_permission_group === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_sys") || 
			req.body.data.cust_group_permission_sys === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_dir") || 
			req.body.data.cust_group_permission_dir === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_fun") || 
			req.body.data.cust_group_permission_fun === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("cust_group_permission_auth")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check existed
			let conditions = {
				"Group_Id": req.body.data.cust_group_permission_group,
				"System_Id": req.body.data.cust_group_permission_sys,
				"Directory_Id": req.body.data.cust_group_permission_dir,
				"Function_Id": req.body.data.cust_group_permission_fun,
			};
			if(req.body.data.hasOwnProperty("cust_group_permission_auth") && req.body.data.cust_group_permission_auth !== "") 
				conditions.Auth = req.body.data.cust_group_permission_auth;

			const isExisted = await custGroupPermissionRepository.isCustGroupPermissionsExisted(conditions);
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete data
			await custGroupPermissionRepository.destroyCustGroupPermissions(conditions);
			
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