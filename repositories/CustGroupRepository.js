/**
 * CustGroups 之資料存取層 
 * @module repository/CustGroupRepository
 */

"use strict";

/**
 * 檢查指定條件的客戶群組是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Id: custGroupId }。
 * @return {Boolean} 如果群組存在，為true，反之false。
 */
module.exports.isCustGroupsExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupModule.findAll({
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
 * 取得指定條件的客戶群組。
 * @param  {Object} attributes 顯示欄位，eg: [["Id", "cg_id"],]。
 * @param  {Object} condition 查詢條件，eg: { "Id: custGroupId }。
 */
module.exports.getCustGroups = (attributes, conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
				
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupModule.findAll({
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
 * 新增客戶群組。
 * @param  {Object} custGroupModuleData 欲新增之客戶群組資料。
  */
module.exports.createCustGroup = (custGroupModuleData) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
				
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t){
						return custGroupModule.create(custGroupModuleData, {transaction: t, })
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
 * 刪除客戶群組。
 * @param {Object} conditions 刪除條件，eg: { "Id: custGroupId }。
 */
module.exports.destroyCustGroup = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
				
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return custGroupModule.destroy({ where: conditions, transaction: t, })
							.then(() => { resolve(); })
							.catch((err) => { throw(err); }); 
					});
				})
				.catch((err) => { reject(err); }); 
		});

		//[TODO]: 群組刪除是否要連動刪除群組使用者&群組權限?
	}
	catch(err){	
		throw(err);
	}
};

/**
 * 更新客戶群組
 * @param  {Object} conditions 更新條件，eg: { "Id: custGroupId }。
 * @param  {Object} custGroupModuleData 欲更新之客戶群組資料(需注意如果變更群組ID可能會造成異常，盡量不要變更群組ID)。
 */
module.exports.setCustGroup = (custGroupModuleData, conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return custGroupModule.update( custGroupModuleData, { where: conditions, transaction: t, })
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