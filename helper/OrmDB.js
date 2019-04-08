/**
 * 系統資料庫連線設定
 * @module helper/OrmDB
 */

"use strict";

const config     = require("../Config");
const _sequelize = require("sequelize");

module.exports = {
	"KumonCheckIN": new _sequelize( 
		config[process.env.NODE_ENV].database_config.KumonCheckIN.database, 
		config[process.env.NODE_ENV].database_config.KumonCheckIN.username, 
		config[process.env.NODE_ENV].database_config.KumonCheckIN.password, 
		config[process.env.NODE_ENV].database_config.KumonCheckIN.options
	),
	"sequelize": _sequelize, 
	"op": _sequelize.Op,
};