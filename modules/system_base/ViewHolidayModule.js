/**
 * 假日模組
 * @module modules/system_base/ViewHolidayModule
 */

"use strict";

/**
 * 建立假日模組
 */
const buildViewHolidayModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Holidays", {
		/* 日期 */
		Hdate: {
			type: ormDB.sequelize.STRING,
			primaryKey: true,
		},
		/* 註解 */
		Memo: {
			type: ormDB.sequelize.STRING
		},
		/**/
		Flag_Am: {
			type: ormDB.sequelize.STRING
		},
		/* 建立使用者ID */
		User_Id: {
			type: ormDB.sequelize.STRING
		},
		/* 更新時間 */
		Update_Date: {
			type: ormDB.sequelize.STRING
		},
		/* 國別 */
		Nation: {
			type: ormDB.sequelize.STRING,
			primaryKey: true,
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Holidays",
		name: {singular: "Holidays", plural: "Holidays",},
		underscored: true,
	});
};

module.exports = buildViewHolidayModule();