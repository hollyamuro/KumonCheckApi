/**
 * 客戶資料(from託管系統)模組
 * @module modules/checkinModule
 */

"use strict";

/**
 * 建立客戶資料模組
 */
const buildcheckinModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("check_in", {
		date: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		start: {
			type: ormDB.sequelize.STRING,
		},
		end: {
			type: ormDB.sequelize.STRING,
		},
		ID: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		office: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		type: {
			type: ormDB.sequelize.STRING,
			primaryKey: true
		},
		checkin_time: {
			type: ormDB.sequelize.STRING,
		},
		checkin_office: {
			type: ormDB.sequelize.STRING,
		},
		checkout_time: {
			type: ormDB.sequelize.STRING,
		},
		checkout_offic: {
			type: ormDB.sequelize.STRING,
		},
		contacted: {
			type: ormDB.sequelize.BOOLEAN,
		},
		note: {
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
		tableName: "check_in",
		name: {singular: "check_in", plural: "check_in",},
		underscored: true,
	});
};

module.exports = buildcheckinModule();