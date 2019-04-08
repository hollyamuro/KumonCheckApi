/**
 * Cust Account模組
 * @module modules/system_base/Cust_AccountModule
 */
 
"use strict";

/**
 * 建立使用者模組
 */
const Cust_AccountModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Cust_Account", {
		/* account */
		account: {
			type: ormDB.sequelize.STRING,
			//autoIncrement: true,
			primaryKey: true
		},
		/* account */
		sino_account: {
			type: ormDB.sequelize.STRING,
			//autoIncrement: true,
			primaryKey: true
		},
		/* password */
		password: {
			type: ormDB.sequelize.STRING
		},  
		/* passwordsalt */
		passwordsalt: {
			type: ormDB.sequelize.INTEGER
		},  
		/* accountsalt */
		accountsalt: {
			type: ormDB.sequelize.STRING
		},  
		/* accounthash */
		accounthash: {
			type: ormDB.sequelize.INTEGER
		},  
		/* name */
		name: {
			type: ormDB.sequelize.STRING
		},
		/* phone */
		phone: {
			type: ormDB.sequelize.STRING
		},
		/* status */
		status: {
			type: ormDB.sequelize.INTEGER
		},
		/* url */
		url: {
			type: ormDB.sequelize.STRING
		},
		/* reset_url */
		reset_url: {
			type: ormDB.sequelize.STRING
		},
		/* count */
		count: {
			type: ormDB.sequelize.INTEGER
		},  
		/* mail_count */
		mail_count: {
			type: ormDB.sequelize.INTEGER
		},
		/* verify_code */
		verify_code: {
			type: ormDB.sequelize.STRING
		},
		/*  */
		url_expire: {
			type: ormDB.sequelize.STRING
		},
		/* status */
		reset_url_expire: {
			type: ormDB.sequelize.STRING
		},
		/* status */
		expire_date: {
			type: ormDB.sequelize.STRING
		},
		/* create_date */
		create_date: {
			type: ormDB.sequelize.STRING
		},
		/* edit_date */
		edit_date: {
			type: ormDB.sequelize.STRING
		}
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Cust_Account",
		name: {singular: "Cust_Account", plural: "Cust_Account",},
		underscored: true,
	});
};

module.exports = Cust_AccountModule();
