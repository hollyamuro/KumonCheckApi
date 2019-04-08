/**
 * 群組使用者模組
 * @module modules/system_base/GroupUserModule
 */

"use strict";

/**
 * 建立群組使用者模組
 */
const buildGroupUserModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("Group_Users", {
		/* 使用者ID */
		User_Id: {
			type: ormDB.sequelize.INTEGER,
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
		tableName: "Group_Users",
		name: {singular: "Group_Users", plural: "Group_Users",},
		underscored: true,
	});
};

module.exports = buildGroupUserModule();