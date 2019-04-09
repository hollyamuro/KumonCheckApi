/**
 * 客戶資料(from託管系統)模組
 * @module modules/studentModule
 */

"use strict";

/**
 * 建立客戶資料模組
 */
const buildstudentModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("student", {
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
		mobile: {
			type: ormDB.sequelize.STRING,
		},
		parent: {
			type: ormDB.sequelize.STRING,
		},
		class_date: {
			type: ormDB.sequelize.BOOLEAN,
		},
		class_type: {
			type: ormDB.sequelize.STRING,
		},
		class_level: {
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
		tableName: "student",
		name: {singular: "student", plural: "student",},
		underscored: true,
	});
};

module.exports = buildstudentModule();