
/**
 * Employees 之資料存取層 
 * @module repository/system_base/ViewEmployeeRepository
 */

"use strict";

/**
 * 取得員工資料。
 * @param  {Object} conditions 查詢條件，eg: { "User_Id": userId },
 * @return {Array.<Object>} 取得之員工資料。
 */
module.exports.getEmployees = (conditions) => {
	try {
		const ormDB = require("../../helper/OrmDB");
		const viewEmployeeModule = require("../../modules/system_base/ViewEmployeeModule");
		const viewDeptModule = require("../../modules/system_base/ViewDeptModule");

		// set associations
		viewEmployeeModule.hasMany(viewDeptModule, { foreignKey: "Dept_No", sourceKey: "Dept_No", });
		viewDeptModule.belongsTo(viewEmployeeModule, { foreignKey: "Dept_No", targetKey: "Dept_No", });

		return new Promise((resolve, reject) => {
			ormDB.KumonCheckIN.authenticate()
				.then(() => {
					return viewEmployeeModule.findAll({
						attributes: [
							["User_Id", "e_user_id"],
							["User_Name", "e_user_name"],
							["Dept_No", "e_dept_no"],
						],
						where: conditions,
						order: ["User_Id"],
						raw: true,
						include: [
							{
								model: viewDeptModule,
								attributes: [
									["Dept_No", "d_dept_no"],
									["Dept_Na", "d_dept_na"],
								],
								required: true,
							},
						],
					});
				})
				.then((r) => {
					resolve(r.map(i => ({
						employee_id: i["e_user_id"].toString().trim(),
						employee_name: i.e_user_name.toString().trim(),
						dept_id: i.e_dept_no.toString().trim(),
						dept_name: i["Depts.d_dept_na"].toString().trim(),
					})));
				})
				.catch((err) => { reject(err); });
		});
	}
	catch (err) {
		throw (err);
	}
};
