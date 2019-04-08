/**
 * 客戶資料(from託管系統)模組
 * @module modules/Custs
 */

"use strict";

/**
 * 建立客戶資料模組
 */
const buildCustModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Custs", {
		account_no: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		account_name: {
			type: ormDB.sequelize.STRING,
		},
		email: {
			type: ormDB.sequelize.STRING,
		},
		acc_status: {
			type: ormDB.sequelize.STRING,
		},
		acc_type: {
			type: ormDB.sequelize.STRING,
		},
		sino_account: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Custs",
		name: {singular: "Custs", plural: "Custs",},
		underscored: true,
	});
};

module.exports = buildCustModule();