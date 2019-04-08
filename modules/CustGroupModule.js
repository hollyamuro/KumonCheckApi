/**
 * 客戶群組模組
 * @module modules/CustGroupModule
 */

"use strict";

/**
 * 建立客戶群組模組
 */
module.exports = (() => {
	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Cust_Groups", {
		/* 群組ID */
		Id: {
			type: ormDB.sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		/* 群組名稱 */
		Name: {
			type: ormDB.sequelize.STRING
		},
		/* 群組描述說明 */
		Description: {
			type: ormDB.sequelize.STRING
		},
		/* 群組角色: 控制資料權限 */
		Role: {
			type: ormDB.sequelize.STRING
		},
		/* 群組產品: 控制產品資料權限 */
		Product: {
			type: ormDB.sequelize.STRING
		}
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Cust_Groups",
		name: {singular: "Cust_Groups", plural: "Cust_Groups",},
		underscored: true,
	});
})();