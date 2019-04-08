/**
 * employee 之資料存取層 
 * @module repository/employeeRepository
 */

"use strict";

/**
 * 檢查指定條件員工是否存在。
 * @param  {Object} conditions 查詢條件，eg:  { "ID": EM ID },
 * @return {Boolean} 如果客戶帳號存在，為true，反之false。
 */
module.exports.isEmployeeExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const EmployeeModule = require("../modules/employeeModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return EmployeeModule.findAll({
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
 * 取得Employee 客戶列表內容。
 * @param  {Object} conditions 查詢條件，eg: { "ID": account number },
 * @return {Array.<Object>} 取得之客戶資料。
 */
module.exports.getEmployee = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const EmployeeModule = require("../modules/employeeModule");
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return EmployeeModule.findAll({
						attributes: 
						[
							["ID", 	"ID"], 
							["office", "office"], 
							["name", "name"], 
							["name_en", "name_en"], 
							["birth", "birth"], 
							["sex", "sex"], 
							["address", 	"address"], 
							["email", "email"], 
							["phone", "phone"], 
							["mobile", "mobile"], 
							["line", "line"], 
							["fb", "fb"], 
							["salary", 	"salary"], 
							["type", "type"], 
							["work_date", "work_date"], 
							["work_time", "work_time"], 
							["create_date", "create_date"], 
							["edit_date", "edit_date"], 
							["edit_user", "edit_user"], 
						],
						where: conditions,
						order: ["ID"],
						raw: true,
					});
				})
				.then((r) => { 
					for(let i = 0; i < r.length; i++){
						r[i].ID	= r[i].ID.trim();
						r[i].office 	= r[i].office.trim();
						r[i].name 		    = r[i].name.trim();
						r[i].name_en 	= r[i].name_en;
						r[i].birth 		= r[i].birth.trim();
						r[i].sex 	= r[i].sex.trim();
						r[i].address		= r[i].address;
						r[i].email 	= r[i].email.trim();
						r[i].phone 		    = r[i].phone.trim();
						r[i].mobile 	= r[i].mobile.trim();
						r[i].line 		= r[i].line;
						r[i].fb 	= r[i].fb;
						r[i].salary		= r[i].salary;
						r[i].type 	= r[i].type.trim();
						r[i].work_date 		    = r[i].work_date.trim();
						r[i].work_time 		    = r[i].work_time.trim();
						r[i].create_date 	= r[i].create_date.trim();
						r[i].edit_date 		= r[i].edit_date.trim();
						r[i].edit_user 	= r[i].edit_user.trim();
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
 * 刪除使用者
 * @param  {Object} conditions 刪除條件
 */
module.exports.destroyEmployee = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const EmployeeModule = require("../modules/employeeModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return EmployeeModule.destroy({ where: conditions, transaction: t, })
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


