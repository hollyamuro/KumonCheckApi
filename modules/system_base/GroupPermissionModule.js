/**
 * 群組權限模組
 * @module modules/system_base/GroupPermissionModule
 */

"use strict";

/**
 * 建立群組權限模組
 */
const buildGroupPermissionModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("Group_Permissions", {
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
		/* 全縣種類 */
		Auth: {
			type: ormDB.sequelize.STRING,
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Group_Permissions",
		name: {singular: "Group_Permissions", plural: "Group_Permissions",},
		underscored: true,
	});
};

module.exports = buildGroupPermissionModule();
