/**
 * Group_Users 之資料存取層 
 * @module repository/system_base/GroupPermissionRepository
 */

"use strict";

/**
 * 檢查指定條件的群組權限是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Group_Id: groupId }。
 * @return {Boolean} 如果群組使用者存在，為true，反之false。
 */
module.exports.isGroupPermissionsExisted = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupPermissionModule = require("../../modules/system_base/GroupPermissionModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return groupPermissionModule.findAll({
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
 * 取得指定條件的群組權限。
 * @param  {Object} condition 查詢條件，eg: { "Group_Id": groupId }。
 */
module.exports.getGroupPermissions = (attributes, conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupPermissionModule = require("../../modules/system_base/GroupPermissionModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return groupPermissionModule.findAll({
						attributes: attributes,
						where: conditions,
						raw: true,
						order: ["System_Id", "Directory_Id", "Function_Id", "Auth"], 
					});
				})
				.then((r) => { resolve(r); })
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){ throw(err); }
};

/**
 * 新增群組權限。
 * @param  {Array.<Object>} groupPermissionModuleDataList 欲新增之群組權限資料。
  */
module.exports.createGroupPermissions = (groupPermissionModuleDataList) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupPermissionModule = require("../../modules/system_base/GroupPermissionModule");
        
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction(function (t){
						let promises = [];
						for(let i=0; i<groupPermissionModuleDataList.length; i++){
							promises.push(groupPermissionModule.create( groupPermissionModuleDataList[i], { transaction: t, }));
						}
						return Promise.all(promises)
							.then(() => {
								resolve();
							})
							.catch((err) => { reject(err); }); 
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
 * 刪除群組權限。
 * @param {Object} conditions 刪除條件，eg: { "Group_Id": groupId }。
 */
module.exports.destroyGroupPermissions = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupPermissionModule = require("../../modules/system_base/GroupPermissionModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction(function (t) {
						return groupPermissionModule.destroy({ where: conditions, transaction: t, })
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