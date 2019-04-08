/**
 * 部門模組
 * @module modules/system_base/ViewDeptModule
 */

"use strict";

/**
 * 建立部門模組
 */
const buildViewDeptModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Depts", {
		/* 部門標號 */
		Dept_No: {
			type: ormDB.sequelize.STRING,
			primaryKey: true,
		},
		/* 部門名稱 */
		Dept_Na: {
			type: ormDB.sequelize.STRING
		},
		/**/
		Broker_No: {
			type: ormDB.sequelize.STRING
		},
		/**/
		Dept_Na1: {
			type: ormDB.sequelize.STRING
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Depts",
		name: {singular: "Depts", plural: "Depts",},
		underscored: true,
	});
};

module.exports = buildViewDeptModule();