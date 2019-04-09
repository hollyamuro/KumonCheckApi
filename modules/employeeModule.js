/**
 * 客戶資料(from託管系統)模組
 * @module modules/employeeModule
 */

"use strict";

/**
 * 建立客戶資料模組
 */
const buildemployeeModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("check_in", {
		ID: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		office: {
			type: ormDB.sequelize.STRING,
		},
		name: {
			type: ormDB.sequelize.STRING,
		},
		name_en: {
			type: ormDB.sequelize.STRING,
		},
		birth: {
			type: ormDB.sequelize.STRING,
		},
		sex: {
			type: ormDB.sequelize.STRING,
		},
		address: {
			type: ormDB.sequelize.STRING,
		},
		email: {
			type: ormDB.sequelize.STRING,
		},
		phone: {
			type: ormDB.sequelize.STRING,
		},
		mobile: {
			type: ormDB.sequelize.STRING,
		},
		line: {
			type: ormDB.sequelize.STRING,
		},
		fb: {
			type: ormDB.sequelize.STRING,
		},
		salary: {
			type: ormDB.sequelize.INTEGER,
		},
		type: {
			type: ormDB.sequelize.STRING,
		},
		work_date: {
			type: ormDB.sequelize.BOOLEAN,
		},
		work_time: {
			type: ormDB.sequelize.STRING,
		},
		create_date: {
			type: ormDB.sequelize.STRING,
		},
		edit_date: {
			type: ormDB.sequelize.STRING,
		},
		edit_user: {
			type: ormDB.sequelize.STRING,
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "employee",
		name: {singular: "employee", plural: "employee",},
		underscored: true,
	});
};

module.exports = buildemployeeModule();