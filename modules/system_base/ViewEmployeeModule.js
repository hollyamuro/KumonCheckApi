/**
 * 員共模組
 * @module modules/system_base/buildViewEmployeeModule
 */

"use strict";

/**
 * 建立員共模組
 */
const buildViewEmployeeModule = () => {

	const ormDB = require("../../helper/OrmDB");
	return ormDB.KumonCheckIN.define("Employees", {
		/* 員工編號 */
		User_Id: {
			type: ormDB.sequelize.STRING,
			primaryKey: true,
		},
		/* 員工姓名 */
		User_Name: {
			type: ormDB.sequelize.STRING
		},
		/* 部門編號 */
		Dept_No: {
			type: ormDB.sequelize.STRING
		},
		/* 維護使用者 */
		Maint_User_Id: {
			type: ormDB.sequelize.STRING
		},
		/* 維護日期 */
		Maint_Date: {
			type: ormDB.sequelize.STRING
		},
		/* 員工狀態 */
		Emp_Sta: {
			type: ormDB.sequelize.STRING
		},
		/**/
		E_Date: {
			type: ormDB.sequelize.STRING
		},
		/**/
		W_Date: {
			type: ormDB.sequelize.STRING
		},
		/**/
		Dept_No_S: {
			type: ormDB.sequelize.STRING
		},
		/* 行動電話 */
		Mob_Tel: {
			type: ormDB.sequelize.STRING
		},
		/* 到職日 */
		B_Date: {
			type: ormDB.sequelize.STRING
		},
		/* 生日 */
		Emp_Bdate: {
			type: ormDB.sequelize.STRING
		},
		/* 身份證字號 */
		Emp_Id: {
			type: ormDB.sequelize.STRING
		},
		/* 電子郵件*/
		Email: {
			type: ormDB.sequelize.STRING
		},
		/**/
		Job_Code: {
			type: ormDB.sequelize.STRING
		},
	},{
		timestamps: false,
		freezeTableName: true, 
		tableName: "Employees",
		name: {singular: "Employees", plural: "Employees",},
		underscored: true,
	});
};

module.exports = buildViewEmployeeModule();
