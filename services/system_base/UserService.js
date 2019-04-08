/**
 * Users 相關之商業邏輯
 * @module services/system_base/user_service
 */

"use strict";

/**
 * 查詢使用者
 * @param  {} req
 * @param  {} res
 * @see /api/staff/users/read
 */
module.exports.selectAllUsers = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const userRepository = require("../../repositories/system_base/UserRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		
		// setup attributes and conditions
		let conditions = {};

		// get data
		const data = await userRepository.getUsersProfile(conditions);		
		
		res.send({	
			"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": data, 
		});
	}
	catch(err){ next(err); }
};

/**
 * 新增使用者
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/users/create
 */
module.exports.insertUser = async (req, res, next) => {

	try
	{
		const bcrypt = require("bcryptjs");
		const messageHandler = require("../../helper/MessageHandler");
		const userRepository = require("../../repositories/system_base/UserRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("employee_id") || req.body.data.employee_id === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
        let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//check user existed
			const isExisted = await userRepository.isUsersExisted({"Employee_Id" : req.body.data.employee_id});
			if(isExisted === true) throw(new Error("ERROR_DUPLICATE_DATA"));

			//hash id
			const HASHID = await bcrypt.hash(req.body.data.employee_id, 10);

			//pwd
			const HASHPWD = await bcrypt.hash(req.body.data.employee_id, 10);
	
			//insert user
			await userRepository.createUser({
				"Employee_Id": 		req.body.data.employee_id.toString(),
				"IdSalt":			HASHID,
				"IdHash":			HASHID,
				"Pwd": 				HASHPWD,
				"PwdSalt": 			HASHPWD,
				"AccountStatus": 	1,
				"ErrorCounts": 		0,
				"IsBlock": 			0,
			});
			
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
 * 刪除使用者
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/users/delete
 */
module.exports.deleteUser = async (req, res, next) => {

	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const userRepository = require("../../repositories/system_base/UserRepository");
		const utility = require("../../helper/Utility");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("employee_id")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
        let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check user existed
			const isExisted = await userRepository.isUsersExisted({"Employee_Id" : req.body.data.employee_id});
			if(isExisted === false) throw(new Error("ERROR_NOT_EXISTED_DATA"));

			// delete user
			await userRepository.destroyUser({"Employee_Id" : req.body.data.employee_id});

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
 * 登入驗證，並取得權限資料
 * @param  {} req
 * @param  {} res
 * @see /api/staff/users/login
 */
module.exports.login =  async (req, res, next) => {
	try{
		const axios = require("axios");
		const messageHandler = require("../../helper/MessageHandler");
		const userRepository = require("../../repositories/system_base/UserRepository");
		const utility = require("../../helper/Utility");
		const debug = require("debug")("KumonCheckINApi:UserService.login");
		const config = require("../../Config");
		
		let return_prototype = {	
			"user":  			"", 
			"user_name":  		"", 
			"dept":  			"", 
			"dept_name":  		"", 
			"permission_list": 	[],
			"product_list":		[],
			"role_list":		[],
			"system":			"",
		};

		let jwt_sign_prototype = {	
			"user":  			"",
		};
		// debug(req.body.data);
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("password") || req.body.data.password === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// check user is existed
			const isUsersExisted = await userRepository.isUsersExisted({"Employee_Id": req.body.data.account, });
			if(isUsersExisted === false) throw(new Error("ERROR_NOT_EXISTED_USER"));

			// validate password
			// const isPass = await userRepository.validateLocalPassword(req.body.data.account, req.body.data.password );
			// if(isPass === false ) throw(new Error("ERROR_WRONG_ACCOUNT_OR_PASSWORD"));

			// validate ad
			const isAdPass = await userRepository.validateAD(req.body.data.account, req.body.data.password);
			if(isAdPass === false ) throw(new Error("ERROR_WRONG_ACCOUNT_OR_PASSWORD"));

			// get user data
			const userProfile = await userRepository.getUsersProfile({ "Employee_Id": req.body.data.account });
			
			// get permission
			const permission = await userRepository.getPermissionsOfUser(req.body.data.account);

			// get role
			const roles = await userRepository.getRolesOfUser(req.body.data.account);

			// get product
			const products = await userRepository.getProductsOfUser(req.body.data.account);

			// set return value
			return_prototype = {
				"user":  			userProfile[0].u_hid, 
				"user_name":   		userProfile[0].e_user_name, 
				"dept": 			userProfile[0].d_dept_id, 
				"dept_name": 		userProfile[0].d_dept_name, 
				"permission_list": 	permission,
				"product_list":		products,
				"role_list":		roles,
				"system":			"KumonCheckIN",
			};

			jwt_sign_prototype = {
				"user":  			userProfile[0].u_hid, 
			};
			
			const local = config[process.env.NODE_ENV].JwtService_api.policy + "://" + config[process.env.NODE_ENV].JwtService_api.host + ":" + config[process.env.NODE_ENV].JwtService_api.port;
			//get token
			const token = await axios.post(local + "/api/sign", { "data": jwt_sign_prototype, "system": "KumonCheckIN",});
			debug(token.data.data);
			return_prototype["access_token"] = token.data.data;

			res.send({  
				"code" : messageHandler.infoHandler("INFO_LOGIN_SUCCESS"), 
				"data": return_prototype,
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
 * JWT token 驗證
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/users/verify
 */
module.exports.verify =  async (req, res, next) => {
	try{
		// const debug = require("debug")("KumonCheckINApi:UserService.verify");
		const messageHandler = require("../../helper/MessageHandler");
		const axios = require("axios");
		const config = require("../../Config");
		const userRepository = require("../../repositories/system_base/UserRepository");

		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("token")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		
		let return_prototype = {	
			"user":  			"", 
			"user_name":  		"", 
			"dept":  			"", 
			"dept_name":  		"", 
			"permission_list": 	[],
			"product_list":		[],
			"role_list":		[],
			"system":			"",
		};

		let jwt_sign_prototype = {	
			"user":  			"",
		};

		const local = config[process.env.NODE_ENV].JwtService_api.policy + "://" + config[process.env.NODE_ENV].JwtService_api.host + ":" + config[process.env.NODE_ENV].JwtService_api.port;
		const jwt_user_data = await axios.post(local + "/api/verify", { "token": req.body.token, "system": "KumonCheckIN",});

		if(jwt_user_data.data.login){
			const EmployeeId = await userRepository.getEmployeeId(jwt_user_data.data.user);
			if(EmployeeId.length<1) {
				throw(new Error("ERROR_NOT_EXISTED_USER"));
			}else{
				// get user data
				const userProfile = await userRepository.getUsersProfile({ "Employee_Id":EmployeeId });
				// get permission
				const permission = await userRepository.getPermissionsOfUser(EmployeeId);
				// get role
				const roles = await userRepository.getRolesOfUser(EmployeeId);
				// get product
				const products = await userRepository.getProductsOfUser(EmployeeId);

				return_prototype = {
					"user":  			userProfile[0].u_hid, 
					"user_name":   		userProfile[0].e_user_name, 
					"dept": 			userProfile[0].d_dept_id, 
					"dept_name": 		userProfile[0].d_dept_name, 
					"permission_list": 	permission,
					"product_list":		products,
					"role_list":		roles,
					"system":			"KumonCheckIN",
				};

				jwt_sign_prototype = {
					"user":  			userProfile[0].u_hid, 
				};

				const token = await axios.post(local + "/api/sign", { "data": jwt_sign_prototype, "system": "KumonCheckIN",});
				if(token.data.code.type === "ERROR") {
					throw(new Error("ERROR_TOKEN"));
				}else{
					return_prototype["access_token"] = token.data.data;
				}
				return_prototype["login"] = jwt_user_data.data.login;

				res.send({  
					"code" : messageHandler.infoHandler("INFO_TOKEN_SUCCESS"), 
					"data": return_prototype,
				});
			}
		}else{
			throw(new Error("ERROR_TOKEN"));
		}
	}
	catch(err){ 
		next(err); 
	}
};
