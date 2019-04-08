/**
 * Groups 之資料存取層 
 * @module repository/system_base/GroupRepository
 */

"use strict";

/**
 * 檢查指定條件的群組是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Id: groupId }。
 * @return {Boolean} 如果群組存在，為true，反之false。
 */
module.exports.isGroupsExisted = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupModule = require("../../modules/system_base/GroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return groupModule.findAll({
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
 * @param  {Object} attributes 顯示欄位，eg: [["Id", "g_id"],]。
 * @param  {Object} condition 查詢條件，eg: { "Id: groupId }。
 */
module.exports.getGroups = (attributes, conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupModule = require("../../modules/system_base/GroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return groupModule.findAll({
						attributes: attributes,
						where: conditions,
						raw: true,
					});
				})
				.then((r) => { resolve(r); })
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 新增群組。
 * @param  {Object} groupModuleData 欲新增之群組資料。
  */
module.exports.createGroup = (groupModuleData) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupModule = require("../../modules/system_base/GroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t){
						return groupModule.create(groupModuleData, {transaction: t, })
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
 * 刪除群組。
 * @param {Object} conditions 刪除條件，eg: { "Id: groupId }。
 */
module.exports.destroyGroup = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupModule = require("../../modules/system_base/GroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return groupModule.destroy({ where: conditions, transaction: t, })
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
 * 更新群組
 * @param  {Object} conditions 更新條件，eg: { "Id: groupId }。
 * @param  {Object} groupModuleData 欲更新之群組資料。
 */
module.exports.setGroup = (groupModuleData, conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const groupModule = require("../../modules/system_base/GroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return groupModule.update( groupModuleData, { where: conditions, transaction: t, })
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