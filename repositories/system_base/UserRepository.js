/**
 * Users 之資料存取層 
 * @module repository/system_base/UserRepository
 */

"use strict";

/**
 * 檢查指定條件的使用者是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Employee_Id": employeeId }。
 * @return {Boolean} 如果使用者存在，為true，反之false。
 */
module.exports.isUsersExisted = (conditions) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						where: conditions,
						raw: true,
					});
				})
				.then((r) => { resolve((r.length === 0) ? false : true); })
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 取得使用者資料ID及姓名。
 * @param  {Object} conditions 查詢條件，eg: { "Employee_Id": employeeId }。
 * @return {Array.<Object>} 取得之使用者ID及姓名。
 */
module.exports.getUsersProfile = (conditions) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");
		const viewEmployeeModule = require("../../modules/system_base/ViewEmployeeModule");
		const viewDeptModule = require("../../modules/system_base/ViewDeptModule");

		//set associations
		userModule.hasMany(viewEmployeeModule, { foreignKey: "User_Id", sourceKey: "Employee_Id", });
		viewEmployeeModule.belongsTo(userModule, { foreignKey: "User_Id", targetKey: "Employee_Id", });

		//set associations
		viewEmployeeModule.hasMany(viewDeptModule, { foreignKey: "Dept_No", sourceKey: "Dept_No", });
		viewDeptModule.belongsTo(viewEmployeeModule, { foreignKey: "Dept_No", targetKey: "Dept_No", });

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: [
							"Id", "Employee_Id", "IdHash",
						],
						include: [
							{
								model: viewEmployeeModule,
								attributes: ["User_Name",],
								include: [
									{
										model: viewDeptModule,
										attributes: ["Dept_No", "Dept_Na"],
										required: true,
									},
								],
							},
						],
						where: conditions,
						raw: true,
					});
				})
				.then((r) => {
					let returnList = [];
					for (let i = 0; i < r.length; i++) {
						returnList.push({
							"u_id": r[i]["Id"],
							"u_hid": r[i]["IdHash"],
							"u_employee_id": r[i]["Employee_Id"],
							"e_user_name": r[i]["Employees.User_Name"].toString().trim(),
							"d_dept_id": r[i]["Employees.Depts.Dept_No"],
							"d_dept_name": r[i]["Employees.Depts.Dept_Na"],
						});
					}
					resolve(returnList);
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 取的使用者工號
 * @param  {String} hashedId hash後的使用者工號
 */
module.exports.getEmployeeId = (hashedId) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: ["Employee_Id",],
						where: { "IdHash": hashedId, },
						raw: true,
					});
				})
				.then((r) => {
					resolve((r.length === 0) ? "" : r[0].Employee_Id);
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 取得使用者資料。
 * @param  {Object} attributes 查詢欄位。
 * @param  {Object} conditions 查詢條件，eg: { "Employee_Id": employeeId }。
 * @return {Array.<Object>} 取得之使用者資料。
 */
module.exports.getUsers = (attributes, conditions) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: attributes,
						where: conditions,
						raw: true,
					});
				})
				.then((r) => { resolve(r); })
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 刪除使用者。
 * @param {Object} conditions 刪除條件，eg: { "Employee_Id": employeeId }。
 */
module.exports.destroyUser = (conditions) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return ormDB.KumonCheckIN.transaction((t) => {
						return userModule.destroy({ where: conditions, transaction: t, })
							.then(() => { resolve(); })
							.catch((err) => { throw (err); });
					});
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 新增使用者。
 * @param  {Object} userModule 欲新增之使用者資料，格式請參閱userModule。
 * @see /modules/system_base/UserModule
  */
module.exports.createUser = (userModuleDate) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return ormDB.KumonCheckIN.transaction((t) => {
						return userModule.create(userModuleDate, { transaction: t, })
							.then(() => { resolve(); })
							.catch((err) => { throw (err); });
					});
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 驗證密碼(local)。
 * @param  {String} reqEmployeeId 使用者員工編號
 * @param  {String} reqPwd 使用者輸入之密碼
 * @return 驗證正確，為true，反之false。
 */
module.exports.validateLocalPassword = (reqEmployeeId, reqPwd) => {
	try {
		const Bcrypt = require("bcryptjs");
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: [
							["Id", "u_id"],
							["Employee_Id", "u_employee_id"],
							["Pwd", "u_pwd"],
							["PwdSalt", "u_pwdsalt"],
						],
						where: { "Employee_Id": reqEmployeeId },
						raw: true,
					});
				})
				.then((r) => {
					if (r.length > 0) {
						let dbPwd = r[0]["u_pwd"].toString().trim();
						Bcrypt.compare(reqPwd, dbPwd).then(function (res) {
							resolve(res); 
						});
					}
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * AD認證
 * @param  {String} reqEmployeeId 使用者員工編號
 * @param  {String} reqPwd 使用者輸入之密碼
 * @return 驗證正確，為true，反之false。
 */
module.exports.validateAD = (reqEmployeeId, reqPwd) => {
	try {
		const config = require("../../Config");
		const axios = require("axios");

		return new Promise((resolve, reject) => {

			let local = config[process.env.NODE_ENV].IntegratedProxyService_api.policy + "://" +
				config[process.env.NODE_ENV].IntegratedProxyService_api.host + ":" +
				config[process.env.NODE_ENV].IntegratedProxyService_api.port;

			return axios.post(local + "/api/isADAuthenticated/", { "username": reqEmployeeId, "password": reqPwd, })
				.then((response) => {
					resolve((response.data.data.AuthResult === "True") ? true : false);
				}).catch((error) => {
					reject(error);
				});
		});
	}
	catch (err) {
		throw (err);
	}
};

/**
 * 取得使用者所屬群組權限
 * @param  {String} employeeId 員工編號
 * @return {Array.<Object>} 權限列表
 */
module.exports.getPermissionsOfUser = (employeeId) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");
		const groupPermissionModule = require("../../modules/system_base/GroupPermissionModule");

		//set associations
		userModule.hasMany(groupUserModule, { foreignKey: "User_Id", sourceKey: "Id", });
		groupUserModule.belongsTo(userModule, { foreignKey: "User_Id", targetKey: "Id", });

		//set associations
		groupUserModule.hasMany(groupPermissionModule, { foreignKey: "Group_Id", sourceKey: "Group_Id", });
		groupPermissionModule.belongsTo(groupUserModule, { foreignKey: "Group_Id", targetKey: "Group_Id", });

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: [],
						where: { "Employee_Id": employeeId },
						raw: true,
						include: [
							{
								model: groupUserModule,
								attributes: ["Group_Id"],
								required: true,
								include: [
									{
										model: groupPermissionModule,
										attributes: ["System_Id", "Directory_Id", "Function_Id", "Auth"],
										required: true,
									},
									// {   model: groupModule, 
									// 	attributes: ["Id", "Role"],
									// 	required: true,
									// },
								],
							},
						],
					});
				})
				.then((r) => {
					let permission = {};

					r.sort((a, b) => {
						let keyA = a["Group_Users.Group_Permissions.System_Id"] +
							a["Group_Users.Group_Permissions.Directory_Id"] +
							a["Group_Users.Group_Permissions.Function_Id"];

						let keyB = b["Group_Users.Group_Permissions.System_Id"] +
							b["Group_Users.Group_Permissions.Directory_Id"] +
							b["Group_Users.Group_Permissions.Function_Id"];

						return (keyA === keyB) ? 0 : ((keyA > keyB) ? 1 : -1);
					});

					for (let i = 0; i < r.length; i++) {
						let key = r[i]["Group_Users.Group_Permissions.System_Id"] +
							r[i]["Group_Users.Group_Permissions.Directory_Id"] +
							r[i]["Group_Users.Group_Permissions.Function_Id"];

						if (!permission.hasOwnProperty(key)) {
							permission[key] = {
								"System_Id": r[i]["Group_Users.Group_Permissions.System_Id"],
								"Directory_Id": r[i]["Group_Users.Group_Permissions.Directory_Id"],
								"Function_Id": r[i]["Group_Users.Group_Permissions.Function_Id"],
								"Auth": [],
							};
						}
						permission[key].Auth.push(r[i]["Group_Users.Group_Permissions.Auth"]);
					}
					resolve(Object.values(permission));
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) { throw (err); }
};

/**
 * 取得使用者所屬群組角色
 * @param  {String} employeeId 員工編號
 * @return {Array.<String>} 角色列表
 */
module.exports.getRolesOfUser = (employeeId) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");
		const groupModule = require("../../modules/system_base/GroupModule");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");

		//set associations
		userModule.hasMany(groupUserModule, { foreignKey: "User_Id", sourceKey: "Id", });
		groupUserModule.belongsTo(userModule, { foreignKey: "User_Id", targetKey: "Id", });

		//set associations
		groupUserModule.hasMany(groupModule, { foreignKey: "Id", sourceKey: "Group_Id", });
		groupModule.belongsTo(groupUserModule, { foreignKey: "Id", targetKey: "Group_Id", });

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: [],
						where: { "Employee_Id": employeeId },
						raw: true,
						include: [
							{
								model: groupUserModule,
								attributes: [],
								required: true,
								include: [
									{
										model: groupModule,
										attributes: ["Role"],
										required: true,
									},
								],
							},
						],
					});
				})
				.then((r) => {
					let roles = {};
					r.map((role) => {
						if (role["Group_Users.Groups.Role"] && role["Group_Users.Groups.Role"] !== "")
							roles[(role["Group_Users.Groups.Role"])] = true;
					});
					resolve(Object.keys(roles));
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) { throw (err); }
};

/**
 * 取得使用者所屬群組產品
 * @param  {String} employeeId 員工編號
 * @return {Array.<String>} 產品列表
 */
module.exports.getProductsOfUser = (employeeId) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const userModule = require("../../modules/system_base/UserModule");
		const groupModule = require("../../modules/system_base/GroupModule");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");

		//set associations
		userModule.hasMany(groupUserModule, { foreignKey: "User_Id", sourceKey: "Id", });
		groupUserModule.belongsTo(userModule, { foreignKey: "User_Id", targetKey: "Id", });

		//set associations
		groupUserModule.hasMany(groupModule, { foreignKey: "Id", sourceKey: "Group_Id", });
		groupModule.belongsTo(groupUserModule, { foreignKey: "Id", targetKey: "Group_Id", });

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return userModule.findAll({
						attributes: [],
						where: { "Employee_Id": employeeId },
						raw: true,
						include: [
							{
								model: groupUserModule,
								attributes: [],
								required: true,
								include: [
									{
										model: groupModule,
										attributes: ["Product"],
										required: true,
									},
								],
							},
						],
					});
				})
				.then((r) => {
					let products = {};
					r.map((p) => {
						if (p["Group_Users.Groups.Product"] && p["Group_Users.Groups.Product"] !== "")
							products[(p["Group_Users.Groups.Product"])] = true;
					});
					resolve(Object.keys(products));
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) { throw (err); }
};