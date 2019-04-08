/**
 * Cust Account模組
 * @module modules/Cust_AccountModule
 */
 
"use strict";

/**
 * 建立使用者模組
 */
const Cust_Account_LogModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("Cust_Account_Log", {
		/*INDEX_NO*/
		INDEX_NO: {
			type: ormDB.sequelize.STRING,
			autoIncrement: true,
			primaryKey: true
		},
		/*Action_Type*/
		action_type: {
			type: ormDB.sequelize.STRING,
		},
		/*Action_Date*/
		action_date: {
			type: ormDB.sequelize.STRING,
		},
		/*Action_User*/
		action_user: {
			type: ormDB.sequelize.STRING,
		},
		/* account */
		account: {
			type: ormDB.sequelize.STRING,
			//autoIncrement: true,
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
			type: ormDB.sequelize.STRING
		},  
		/* accountsalt */
		accountsalt: {
			type: ormDB.sequelize.STRING
		}, 
		/* accounthash */
		accounthash: {
			type: ormDB.sequelize.STRING
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
		/*url_expire */
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
		tableName: "Cust_Account_Log",
		name: {singular: "Cust_Account_Log", plural: "Cust_Account_Log",},
		underscored: true,
	});
};

module.exports = Cust_Account_LogModule();
