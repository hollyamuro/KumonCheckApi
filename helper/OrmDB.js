/**
 * 系統資料庫連線設定
 * @module helper/OrmDB
 */

"use strict";

const config     = require("../Config");
const _sequelize = require("sequelize");

module.exports = {
	"KumonCheckINWeb": new _sequelize( 
		config[process.env.NODE_ENV].database_config.KumonCheckINWeb.database, 
		config[process.env.NODE_ENV].database_config.KumonCheckINWeb.username, 
		config[process.env.NODE_ENV].database_config.KumonCheckINWeb.password, 
		config[process.env.NODE_ENV].database_config.KumonCheckINWeb.options
	),
	"BondGolDB": new _sequelize( 
		config[process.env.NODE_ENV].database_config.BondGol.database, 
		config[process.env.NODE_ENV].database_config.BondGol.username, 
		config[process.env.NODE_ENV].database_config.BondGol.password, 
		config[process.env.NODE_ENV].database_config.BondGol.options
	),
	"sequelize": _sequelize, 
	"op": _sequelize.Op,
};