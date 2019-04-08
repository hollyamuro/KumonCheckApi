/**
 * Group_Users 之資料存取層 
 * @module repository/system_base/GroupUserRepository
 */

"use strict";

/**
 * 檢查指定條件的群組使用者是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Group_Id: groupId, User_Id: userId, }。
 * @return {Boolean} 如果群組使用者存在，為true，反之false。
 */
module.exports.isGroupUsersExisted = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return groupUserModule.findAll({
						where: conditions,
						raw: true,
					});
				})
				.then((r) => { resolve((r.length === 0) ? false: true); })
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 取得指定條件的群組。
 * @param  {Object} condition 查詢條件，eg: { "Group_Id": groupId }。
 */
module.exports.getGroupUsers = ( conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");
		const userModule = require("../../modules/system_base/UserModule");
		const viewEmployeeModule = require("../../modules/system_base/ViewEmployeeModule");
		const viewDeptModule = require("../../modules/system_base/ViewDeptModule");
		
		//left join user and group user
		userModule.hasMany(groupUserModule,{foreignKey:"User_Id", sourceKey: "Id", });
		groupUserModule.belongsTo(userModule, {foreignKey:"User_Id", targetKey: "Id", });

		//left join user and employee
		userModule.hasMany(viewEmployeeModule, { foreignKey: "User_Id",  sourceKey: "Employee_Id", });
		viewEmployeeModule.belongsTo(userModule, { foreignKey: "User_Id",  targetKey: "Employee_Id", });

		//set associations
		viewEmployeeModule.hasMany(viewDeptModule, { foreignKey: "Dept_No",  sourceKey: "Dept_No", });
		viewDeptModule.belongsTo(viewEmployeeModule, { foreignKey: "Dept_No",  targetKey: "Dept_No", });
			
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return groupUserModule.findAll({
						where: conditions,
						raw: true,
						include: [
							{   model: userModule, 
								attributes:["Id", "Employee_Id"],
								required: true,
								include: [
									{   model: viewEmployeeModule, 
										attributes: [ "User_Name" ],
										required: true,
										include: [
											{   model: viewDeptModule, 
												attributes: [ "Dept_No", "Dept_Na" ],
												required: true,
											},
										],
									},
								],
							},
						],
					});
				})
				.then((r) => { 
					let returnList = [];
					for(let i=0; i<r.length; i++) {
						returnList.push({
							"id": 			r[i]["Users.Id"],
							"employee_id": 	r[i]["Users.Employee_Id"],
							"employee_name": 		r[i]["Users.Employees.User_Name"].toString().trim(),
							"dept_id":		r[i]["Users.Employees.Depts.Dept_No"],
							"dept_name":		r[i]["Users.Employees.Depts.Dept_Na"],
						});
					}
					resolve(returnList); 
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){ throw(err); }
};

/**
 * 新增群組使用者。
 * @param  {Object} groupUserModuleData 欲新增之群組使用者資料。
  */
module.exports.createGroupUser = (groupUserModuleData) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction(function (t){
						return groupUserModule.create(groupUserModuleData, {transaction: t, })
							.then(() => { resolve(); })
							.catch((err) => { throw(err); }); 
					});
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){	
		throw(err);
	}
};

/**
 * 刪除群組使用者。
 * @param {Object} conditions 刪除條件，eg: { "User_Id: userId }。
 */
module.exports.destroyGroupUser = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupUserModule = require("../../modules/system_base/GroupUserModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction(function (t) {
						return groupUserModule.destroy({ where: conditions, transaction: t, })
							.then(() => { resolve(); })
							.catch((err) => { throw(err); }); 
					});
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){	
		throw(err);
	}
};