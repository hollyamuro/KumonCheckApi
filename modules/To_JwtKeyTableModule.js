/**
 * To_JwtKeyTable模組
 * @module modules/To_JwtKeyTableModule
 */
 
"use strict";

/**
 * JWT Key模組
 */
const To_JwtKeyTableModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.BondGolDB.define("To_JwtKeyTable", {
		/* system type */
		SystemType: {
			type: ormDB.sequelize.STRING,
			//autoIncrement: true,
			primaryKey: true
		},
		/* jwt key */
		JwtKey: {
			type: ormDB.sequelize.STRING,
			//autoIncrement: true,
		},
		
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "To_JwtKeyTable",
		name: {singular: "To_JwtKeyTable", plural: "To_JwtKeyTable",},
		underscored: true,
	});
};

module.exports = To_JwtKeyTableModule();
