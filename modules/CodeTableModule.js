/**
 * Cust Account模組
 * @module modules/Cust_AccountModule
 */
 
"use strict";

/**
 * 建立使用者模組
 */
const CodeTableModule = () => {

	const ormDB = require("../helper/OrmDB");
	return ormDB.KumonCheckINWeb.define("CodeTable",
	 {
		/*SeqNo*/
			SeqNo: {
				type: ormDB.sequelize.STRING,
				primaryKey: true
			},
			/*CodeID1*/
			CodeID1: {
				type: ormDB.sequelize.STRING,
				primaryKey: true
			},
			/*CodeDesc1*/
			CodeDesc1: {
				type: ormDB.sequelize.STRING,
			},
			/*CodeID2*/
			CodeID2: {
				type: ormDB.sequelize.STRING,
			},
			/* CodeDesc2 */
			CodeDesc2: {
				type: ormDB.sequelize.STRING,
			},
			/* Remark */
			Remark: {
				type: ormDB.sequelize.STRING,
			},
		},
		{
			timestamps: false,
			freezeTableName: true, 
			tableName: "CodeTable",
			name: {singular: "CodeTable", plural: "CodeTable",},
			underscored: true,
		});
};

module.exports = CodeTableModule();
