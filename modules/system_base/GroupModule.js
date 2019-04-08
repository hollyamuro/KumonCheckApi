/**
 * 群組模組
 * @module modules/system_base/GroupModule
 */

"use strict";

/**
 * 建立群組模組
 */
const buildGroupModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("Groups", {
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
		/* 群組商品: 控制資料權限 */
		Product: {
			type: ormDB.sequelize.STRING
		}

	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Groups",
		name: {singular: "Groups", plural: "Groups",},
		underscored: true,
	});
};

module.exports = buildGroupModule();