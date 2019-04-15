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
 * @param  {Object} conditions 查詢條件，eg: {"key":key,"operator":"=<>","value":"123124125",....},
 * @return {Array.<Object>} 。
 */
module.exports.CheckIn = (conditions,values) => {
	try
	{
		const utility=require("../helper/Utility");
		const ormDB = require("../helper/OrmDB");
		let count=0;
		let where="";
		let i=0;
		let sql = 
		`
			DECLARE @date AS datetime
			DECLARE @office AS varchar(15)
			DECLARE @emp AS varchar(15)
			set @date=?
			set @office=?
			set @emp=?
			UPDATE check_in set
			checkin_time=CASE WHEN checkin_time='19000101' THEN @date ELSE checkin_time END,
			checkin_offic=CASE WHEN checkin_time='19000101' THEN @office ELSE checkin_offic END ,
			checkout_time=@date,
			checkout_offic=@office,
			edit_date=getdate(),
			edit_user=@emp
			where 1=1
		`;
		for(count=0;count<conditions.length;count++)
		{
			where=where+" and "+conditions[count].key+conditions[count].operator+"'"+conditions[count].value+"'";
		}
		sql=sql+where;
		return new Promise((resolve, reject)=> {
			return ormDB.KumonCheckIN.authenticate()
				.then(() => {   
					return ormDB.KumonCheckIN.query(sql, 
						{ 
							replacements: [
								values.datetime,
								values.office,
								values.editor,
							], 
							type: ormDB.sequelize.QueryTypes.UPDATE ,
							raw: true,
						}
					);  
				})
				.then(()=>{
					resolve();
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
 * 刪除打卡
 * @param  {Object} conditions 刪除條件
 */
module.exports.destroyCheckIn = (conditions) => {
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

