
/**
 * Depts 之資料存取層 
 * @module repository/system_base/ViewDeptRepository
 */

"use strict";
 
/**
 * 取得部門資料。
 * @param  {Object} conditions 查詢條件，eg: { "Dept_No": deptNo }。
 * @return {Array.<Object>} 取得之部門資料。
 */
module.exports.getDepts = (conditions) => {
	try
	{
		const ormDB = require("../../helper/OrmDB");
		const viewDeptModule = require("../../modules/system_base/ViewDeptModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return viewDeptModule.findAll({
						attributes: [
							["Dept_No", "d_dept_no"], 
							["Dept_Na", "d_dept_na"], 
						],
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