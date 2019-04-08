/**
 * 客戶群組使用者模組
 * @module modules/CustGroupUserModule
 */

"use strict";

/**
 * 建立客戶群組使用者模組
 */

module.exports = (() => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("Cust_Group_Users", {
		/* 客戶ID */
		Account_No: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		/* 銀行ID(only銀行客戶擁有) */
		Sino_Account: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		/* 群組ID */
		Group_Id: {
			type: ormDB.sequelize.INTEGER,
			primaryKey: true
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Cust_Group_Users",
		name: {singular: "Cust_Group_Users", plural: "Cust_Group_Users",},
		underscored: true,
	});
})();