/**
 * check_in之資料存取層 
 * @module repository/checkinRepository
 */

"use strict";

/**
 * 檢查指定打卡時段是否存在。
 * @param  {Object} conditions 查詢條件，eg:  { "date":yyyyMMdd,"ID":ID,"office":office,"type"=type },
 * @return {boolean} true/false 
 */
module.exports.isCheckInExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const checkinModule = require("../modules/checkinModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return checkinModule.findAll({
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
 * 打卡。
 * @param  {Object} conditions 查詢條件，eg: { "date":yyyyMMdd,"ID":ID,"office":office,"type"=type,"checkin_time" },
 * @return {Array.<Object>} 取得之客戶資料。
 */
module.exports.CheckIn = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const CustModule = require("../modules/CustModule");
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return CustModule.findAll({
						attributes: 
						[
							["account_no", 	"account_no"], 
							["account_name", "account_name"], 
							["sino_account", "sino_account"], 
							["email", "email"], 
							["acc_status", "acc_status"], 
							["acc_type", "acc_type"], 
						],
						where: conditions,
						order: ["account_no"],
						raw: true,
					});
				})
				.then((r) => { 
					for(let i = 0; i < r.length; i++){
						r[i].account_no		= r[i].account_no.trim();
						r[i].account_name 	= r[i].account_name.trim();
						r[i].email 		    = r[i].email.trim();
						r[i].acc_status 	= r[i].acc_status.trim();
						r[i].acc_type 		= r[i].acc_type.trim();
						r[i].sino_account 	= r[i].sino_account.trim();
					}
					resolve(r); 
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 刪除打卡
 * @param  {Object} conditions 刪除條件
 */
module.exports.destroyCusts = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const checkinModule = require("../modules/checkinModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction(function (t) {
						return checkinModule.destroy({ where: conditions, transaction: t, })
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

