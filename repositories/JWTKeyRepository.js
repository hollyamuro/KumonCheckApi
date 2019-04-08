/**
 * JWT key 之資料存取層 
 * @module repository/JWTKeyRepository
 */

"use strict";

/**
 * 查詢JWT Key
 * @param {Object} conditions 查詢條件，eg: [ {"key":"To_JwtKeyTable.SystemType","value":"system type"},},
 */
module.exports.getJWTKey= (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const To_JwtKeyTableModule = require("../modules/To_JwtKeyTableModule");

		return new Promise( (resolve, reject ) => {
			ormDB.BondGolDB.authenticate()
				.then(() => {    
					return To_JwtKeyTableModule.findAll({
						where: conditions,
						raw: true,
					});
				})
				.then((r) => {resolve(r);})
				.catch((err) => { reject(err); }); 
		});
	
	}
	catch(err){
		throw(err);
	}
};

/**
 * 更新JWT Key
 * @param  {Object} JwtKey JWT random key。
 * @param  {Object} conditions 查詢條件，欲更新JWT key之系統。
 */
module.exports.updateJwtKey = (JwtKey, conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const To_JwtKeyTableModule = require("../modules/To_JwtKeyTableModule");
		

		return new Promise( (resolve, reject ) => {
			ormDB.BondGolDB.authenticate()
				.then(() => {  
					return ormDB.BondGolDB.transaction(function (t) {
						return To_JwtKeyTableModule.update( JwtKey, { where: conditions, transaction: t, })
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