/**
 * 使用者模組
 * @module modules/system_base/UserModule
 */

"use strict";

/**
 * 建立使用者模組
 */
const buildUserModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Users", {
		/* 使用者ID */
		Id: {
			type: ormDB.sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		/* 員工ID */
		Employee_Id: {
			type: ormDB.sequelize.STRING
		},
		/* ID salt*/
		IdSalt: {
			type: ormDB.sequelize.STRING
		},
		/* Hashed ID*/
		IdHash: {
			type: ormDB.sequelize.STRING
		},
		/* 密碼 */
		Pwd: {
			type: ormDB.sequelize.STRING
		},
		/* 鹽 */
		PwdSalt: {
			type: ormDB.sequelize.STRING
		},
		/* 帳號狀態 */
		AccountStatus: {
			type: ormDB.sequelize.INTEGER
		},
		/* 密碼錯誤次數 */
		ErrorCounts: {
			type: ormDB.sequelize.INTEGER
		},
		/* 是否鎖定 */
		IsBlock: {
			type: ormDB.sequelize.INTEGER
		}
	}, {
		timestamps: false,
		freezeTableName: true,
		tableName: "Users",
		name: { singular: "Users", plural: "Users", },
		underscored: true,
	});
};

module.exports = buildUserModule();
