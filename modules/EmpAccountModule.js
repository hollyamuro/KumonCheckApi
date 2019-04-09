/**
 * Cust Account模組
 * @module modules/system_base/emp_accountModule
 */
 
"use strict";

/**
 * 建立使用者模組
 */
const emp_accountModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("emp_account", {
		/* ID */
		ID: {
			type: ormDB.sequelize.STRING,
			//autoIncrement: true,
			primaryKey: true
		},
		/* password */
		password: {
			type: ormDB.sequelize.STRING,
		},
		/* hash */
		hash: {
			type: ormDB.sequelize.STRING
		},  
		/* status */
		status: {
			type: ormDB.sequelize.STRING
		},  
		/* group */
		group: {
			type: ormDB.sequelize.STRING
		},  
		/* token */
		token: {
			type: ormDB.sequelize.STRING
		},  
		/* expire */
		expire: {
			type: ormDB.sequelize.STRING
		}
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "emp_account",
		name: {singular: "emp_account", plural: "emp_account",},
		underscored: true,
	});
};

module.exports = emp_accountModule();
