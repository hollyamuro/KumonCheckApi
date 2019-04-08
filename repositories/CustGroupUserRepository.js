/**
 * Cust_Group_Users 之資料存取層 
 * @module repository/CustGroupUserRepository
 */

"use strict";

/**
 * 檢查指定條件的客戶群組使用者是否存在。
 * @param  {Object} conditions 查詢條件，eg: { "Group_Id: groupId, Account_Name: accountName, Sino_Account: sinoAccount }。
 * @return {Boolean} 如果客戶群組使用者存在，為true，反之false。
 */
module.exports.isCustGroupUsersExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupUserModule = require("../modules/CustGroupUserModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupUserModule.findAll({
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
 * @param  {Object} condition 查詢條件，eg: { "Group_Id: groupId, Account_Name: accountName, Sino_Account: sinoAccount }。
 * @return {Array.<Object>} 客戶群組使用者列表
 */
module.exports.getCustGroupUsers = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupUserModule = require("../modules/CustGroupUserModule");
		// const custModule = require("../modules/CustModule");
		// const custGroupModule = require("../modules/CustGroupModule");
		
		// set associations
		// custGroupUserModule.hasMany(custGroupModule,{foreignKey:"Id", sourceKey: "Group_Id", });
		// custGroupModule.belongsTo(custGroupUserModule, {foreignKey:"Id", targetKey: "Group_Id", });

		// set associations
		// custGroupUserModule.hasMany(custModule, { foreignKey: "account_no",  sourceKey: "Account_No", });
		// custModule.belongsTo(custGroupUserModule, { foreignKey: "account_no",  targetKey: "Account_No", });
	
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupUserModule.findAll({
						where: conditions,
						raw: true,
						// include: [
						// 	{   model: custGroupModule, 
						// 		attributes:["Id", "Name", "Description", "Role", "Product"],
						// 		required: true,
						// 	},
						// 	{   model: custModule, 
						// 		attributes:["account_no", "sino_account"],
						// 		required: true,
						// 		where: {
						// 			[ormDB.op.and]: ormDB.sequelize.where(
						// 				ormDB.sequelize.col("Cust_Group_Users.Sino_Account"), 
						// 				ormDB.sequelize.col("Custs.sino_account")
						// 			),
						// 		},
						// 	},
						// ],
					});
				})
				.then((r) => { 
					for(let i=0; i<r.length; i++) {
						r[i].cgu_account_no = r[i].Account_No;
						r[i].cgu_sino_account = r[i].Sino_Account;
						r[i].cgu_group_id = r[i].Group_Id;

						delete  r[i].Account_No;
						delete  r[i].Sino_Account;
						delete  r[i].Group_Id;
					}
					resolve(r);
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){ throw(err); }
};

/**
 * 新增客戶群組使用者。
 * @param  {Object} custGroupUserModuleData 欲新增之客戶群組使用者資料。
  */
module.exports.createCustGroupUser = (custGroupUserModuleData) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupUserModule = require("../modules/CustGroupUserModule");

		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t){
						return custGroupUserModule.create(custGroupUserModuleData, {transaction: t, })
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
 * 刪除客戶群組使用者。
 * @param {Object} conditions 刪除條件，eg: { "Group_Id: groupId, Account_Name: accountName, Sino_Account: sinoAccount }。
 */
module.exports.destroyCustGroupUser = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupUserModule = require("../modules/CustGroupUserModule");

		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return custGroupUserModule.destroy({ where: conditions, transaction: t, })
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