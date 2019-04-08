/**
 * Cust_Pwd_Reset模組
 * @module modules/CustPwdResetModule
 */
 
"use strict";

/**
 * 建立Cust_Pwd_Reset模組
 */
const CustPwdResetModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Cust_Pwd_Reset", {
		/*INDEX_NO*/
		INDEX_NO: {
			type: ormDB.sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		/* account */
		account: {
			type: ormDB.sequelize.STRING
			//autoIncrement: true,
		},
		/* mail */
		mail: {
			type: ormDB.sequelize.STRING
		},
		/* match */
		match: {
			type: ormDB.sequelize.BOOLEAN
		},  
		/* frequently */
		frequently: {
			type: ormDB.sequelize.BOOLEAN
		},
		/* reset_url */
		reset_url: {
			type: ormDB.sequelize.STRING
		},
		/* cust_ip */
		cust_ip: {
			type: ormDB.sequelize.STRING
		},
		/* create_date */
		create_date: {
			type: ormDB.sequelize.STRING
		}
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Cust_Pwd_Reset",
		name: {singular: "Cust_Pwd_Reset", plural: "Cust_Pwd_Reset",},
		underscored: true,
	});
};

module.exports = CustPwdResetModule();
