/**
 * 客戶群組權限模組
 * @module modules/CustGroupPermissions
 */

"use strict";

/**
 * 建立客戶群組權限模組
 */

module.exports = (() => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("Cust_Group_Permissions", {
		/* 群組ID */
		Group_Id: {
			type: ormDB.sequelize.INTEGER,
			primaryKey: true
		},
		/* 系統ID */
		System_Id: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		/* 類別ID */
		Directory_Id: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		/* 功能項ID */
		Function_Id: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		/* 權限種類 */
		Auth: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Cust_Group_Permissions",
		name: {singular: "Cust_Group_Permissions", plural: "Cust_Group_Permissions",},
		underscored: true,
	});
})();
