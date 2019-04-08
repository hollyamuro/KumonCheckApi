/**
 * Cust_Group_Users 之資料存取層 
 * @module repository/CustGroupPermissionRepository
 */

"use strict";

/**
 * 檢查指定條件的客戶群組權限是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Group_Id: groupId }。
 * @return {Boolean} 如果客戶群組權限存在，為true，反之false。
 */
module.exports.isCustGroupPermissionsExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupPermissionsModule = require("../modules/CustGroupPermissionsModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupPermissionsModule.findAll({
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
 * 取得指定條件的客戶群組權限。
 * @param  {Object} condition 查詢條件，eg: { "Group_Id": groupId }。
 * @return {Array.<Object>} 取得之客戶群組權限。
 */
module.exports.getCustGroupPermissions = (attributes, conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupPermissionsModule = require("../modules/CustGroupPermissionsModule");
			
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupPermissionsModule.findAll({
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
 * 新增客戶群組權限。
 * @param  {Array.<Object>} custGroupPermissionModuleDataList 欲新增之群組權限資料。
  */
module.exports.createCustGroupPermissions = (custGroupPermissionModuleDataList) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupPermissionsModule = require("../modules/CustGroupPermissionsModule");
		 
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t){
						let promises = [];
						for(let i=0; i<custGroupPermissionModuleDataList.length; i++){
							promises.push(custGroupPermissionsModule.create( custGroupPermissionModuleDataList[i], { transaction: t, }));
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
 * 刪除客戶群組權限。
 * @param {Object} conditions 刪除條件，eg: { "Group_Id": groupId }。
 */
module.exports.destroyCustGroupPermissions = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupPermissionsModule = require("../modules/CustGroupPermissionsModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return custGroupPermissionsModule.destroy({ where: conditions, transaction: t, })
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