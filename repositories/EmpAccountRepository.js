
/**
 * emp_account 之資料存取層 
 * @module repository/system_base/EmpAccountRepository
 */

"use strict";

/**
 * 檢查指定條件帳號是否存在。
 * @param  {Object} conditions 查詢條件，eg:  { "ID": ID },
 * @return {Boolean} 如果客戶帳號存在，為true，反之false。
 */
module.exports.isEmpAccountsExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const EmpAccountModule = require("../modules/EmpAccountModule");
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return EmpAccountModule.findAll({
						where: conditions,
						raw: true,
					});
				})
				.then((r) => {
					if(r.length === 0){
						resolve(false);
					}else
					{
						if(r[0].status === "A"){
							resolve(true);
						}else{
							resolve(false);
						}
					}
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 取得Emp_Account 主檔內容。
 * @param  {Object} conditions 查詢條件，eg: { "ID":ID},
 * @return {Array.<Object>} 取得之客戶資料。
 */
module.exports.getEmp_Account = (conditions) => {
	try
	{
		const utility=require("../helper/Utility");
		const ormDB = require("../helper/OrmDB");
		const EmpAccountModule = require("../modules/EmpAccountModule");
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return EmpAccountModule.findAll({
						attributes: 
						[
							["ID", "ID"], 
							["password", "password"], 
							["hash", "hash"], 
							["status","status"],
							["group","group"],
							["token","token"],
							["expire", "expire"], 
						],
						where: conditions,
						order: ["ID"],
						raw: true,
					});
				})
				.then((r) => { 
					for(let i = 0; i < r.length; i++){
						r[i].ID		= r[i].ID;
						r[i].password = r[i].password;
						r[i].hash 	= r[i].hash;
						r[i].status = r[i].status;
						r[i].group 	= r[i].group;
						r[i].token 	= r[i].token;
						r[i].expire   = utility.getSqlDateByString(r[i].expire);
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
* 新增Cust Account。
* @param  {Object} Cust_AccountModule 欲新增之使用者資料，格式請參閱Cust_AccountModule。
* @see /modules/system_base/Cust_AccountModule
 */
module.exports.createCust_Account = (EmpAccountModule) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const Cust_AccountModule = require("../modules/EmpAccountModule");
	
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction((t) => {
						return Cust_AccountModule.create(EmpAccountModule, { transaction: t, })
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
 * 更新Cust Account。
* @param  {Object} Cust_AccountModule 欲新增之使用者資料，格式請參閱Cust_AccountModule。
* @see /modules/system_base/Cust_AccountModule
 */
module.exports.set_Cust_Account = (Cust_Account,conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const Cust_AccountModule = require("../modules/EmpAccountModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {    
					return ormDB.KumonCheckIN.transaction((t) =>{
						return Cust_AccountModule.update( Cust_Account, { where: conditions, transaction: t, })
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
* 新增Cust Account log。
* @param  {Object} Cust_Account_Log Module 欲新增之使用者資料異動紀錄，格式請參閱Cust_Account_Log Module。
* @see /modules/system_base/Cust_Account_Log Module
 */
module.exports.createCust_Account_Log = (EmpAccountModule) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const Cust_Account_LogModule = require("../modules/CustAccountLogModule");
	
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {  
					return ormDB.KumonCheckIN.transaction((t) => {
						return Cust_Account_LogModule.create(EmpAccountModule, { transaction: t, })
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
 * 產生CustAccount串接Custs欄位的Table
 * @param {Object} conditions 查詢條件，eg: [ {"key":"Cust_Account.account","value":"myaccount1"},{"key":"Custs.email","value":"sinopac@sinopac.com"}...},
* @see /modules/system_base/Cust_AccountModule
 */
module.exports.getCust_Account_and_Custs= (conditions) => {
	try
	{
		const utility=require("../helper/Utility");
		const ormDB = require("../helper/OrmDB");
		//const debug = require("debug")("KumonCheckINApi:getCust_Account_and_Custs:select by sql");
		let where="";
		let i=0;
		let count=0;
		let sql = 
		`
			select 
			Cust_Account.account,
			Cust_Account.accounthash,
			Cust_Account.sino_account,
			Cust_Account.password,
			Cust_Account.passwordsalt,
			Cust_Account.accountsalt,
			Cust_Account.accounthash,
			Cust_Account.name,
			Cust_Account.phone,
			Cust_Account.status,
			Cust_Account.url,
			Cust_Account.reset_url,
			Cust_Account.count,
			Cust_Account.mail_count,
			Cust_Account.verify_code,
			Cust_Account.url_expire,
			Cust_Account.reset_url_expire,
			Cust_Account.expire_date,
			Cust_Account.create_date,
			Cust_Account.edit_date,
			Custs.email,
			Custs.acc_status,
			Custs.acc_type
			from 
				Cust_Account Cust_Account left join Custs Custs 
			on
				Cust_Account.account=Custs.account_no 
				and Cust_Account.sino_account=Custs.sino_account
			where 1=1
		`;
		for(count=0;count<conditions.length;count++)
		{
			where=where+" and "+conditions[count].key+"='"+conditions[count].value+"'";
		}
		sql=sql+where;
		return new Promise((resolve, reject)=> {
			return ormDB.KumonCheckIN.authenticate()
				.then(() => {   
					return ormDB.KumonCheckIN.query(sql, 
						{ 
							replacements: [], 
							type: ormDB.sequelize.QueryTypes.SELECT ,
							raw: true,
						}
					);  
				})
				.then((r) => { 
					for(i = 0; i < r.length; i++){
						// debug(r);
						r[i].account		= r[i].account;
						r[i].accounthash		= r[i].accounthash;
						r[i].sino_account		= r[i].sino_account;
						r[i].email		= r[i].email;
						r[i].acc_status =r[i].acc_status;
						r[i].acc_type =r[i].acc_type;
						r[i].password 	= r[i].password;
						r[i].passwordsalt 	= r[i].passwordsalt;
						r[i].accountsalt 	= r[i].accountsalt;
						r[i].accounthash 	= r[i].accounthash;
						r[i].name 		    = r[i].name;
						r[i].phone 	= r[i].phone;
						r[i].status 		= r[i].status;
						r[i].url 	= r[i].url;
						r[i].reset_url		= r[i].reset_url;
						r[i].count 	= r[i].count;
						r[i].mail_count = r[i].mail_count;
						r[i].verify_code 	= r[i].verify_code;
						r[i].url_expire 		= utility.getSqlDateByString(r[i].url_expire);
						r[i].reset_url_expire 		= utility.getSqlDateByString(r[i].reset_url_expire);
						r[i].expire_date 		= utility.getSqlDateByString(r[i].expire_date);
						r[i].create_date 	= utility.getSqlDateByString(r[i].create_date);
						r[i].edit_date 	= utility.getSqlDateByString(r[i].edit_date);
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
