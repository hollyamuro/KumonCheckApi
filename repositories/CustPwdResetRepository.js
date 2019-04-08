/**
 * Cust_Pwd_Reset 之資料存取層 
 * @module repository/system_base/ViewCustPwdRestModule
 */

"use strict";

/**
 * 查詢該帳密的忘記密碼紀錄。
 * @param  {Object} conditions 查詢條件，eg:  {"key":"account","operator":"=","value":inputAccount},{"key":"mail","operator":"<>","value":inputUserEmail}},
 * @return {module} CustPwdResetModule。
 */
module.exports.getCustPwdReset = (conditions) => {
	try
	{
		const utility=require("../helper/Utility");
		const ormDB = require("../helper/OrmDB");
		let count=0;
		let where="";
		let i=0;
		let sql = 
		`
			select 
				INDEX_NO,
				account,
				mail,
				match,
				frequently,
				reset_url,
				cust_ip,
				create_date
			from 
				Cust_Pwd_Reset
			where 1=1
		`;
		for(count=0;count<conditions.length;count++)
		{
			where=where+" and "+conditions[count].key+conditions[count].operator+"'"+conditions[count].value+"'";
		}
		sql=sql+where;
		return new Promise((resolve, reject)=> {
			return ormDB.KumonCheckINWeb.authenticate()
				.then(() => {   
					return ormDB.KumonCheckINWeb.query(sql, 
						{ 
							replacements: [], 
							type: ormDB.sequelize.QueryTypes.SELECT ,
							raw: true,
						}
					);  
				})
				.then((r) => { 
					for(i = 0; i < r.length; i++){
						r[i].INDEX_NO		= r[i].INDEX_NO;
						r[i].account		= r[i].account;
						r[i].mail		= r[i].mail;
						r[i].match		= r[i].match;
						r[i].frequently =r[i].frequently;
						r[i].reset_url =r[i].reset_url;
						r[i].cust_ip 	= r[i].cust_ip;
						r[i].create_date 	= utility.getSqlDateByString(r[i].create_date);
					}
					resolve(r);
				})
				.catch((err) => { reject(err); 
				}); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
* 新增Cust_Pwd_Reset 資料。
* @param  {Object} Cust 欲新增之使用者資料，格式請參閱CustPwdResetModule。
* @see /modules/CustPwdResetModule.js
 */
module.exports.createCustPwdReset = (CustPwdResetModule) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const CustPwdReset_Module = require("../modules/CustPwdResetModule");
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction((t) => {
						return CustPwdReset_Module.create(CustPwdResetModule, { transaction: t, })
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


