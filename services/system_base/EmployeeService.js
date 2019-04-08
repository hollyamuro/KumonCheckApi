/**
 * Employee 相關之商業邏輯
 * @module services/system_base/employee_service
 */

"use strict";

/**
 * 取得(在職)員工列表
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/employees/read/valid_employee
 */
module.exports.selectAllValidEmployees = async (req, res, next) => {
	
	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const viewEmployeeRepository = require("../../repositories/system_base/ViewEmployeeRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));

		// setup conditions
		let conditions = { "Emp_Sta": "N", };

		// get data
		const data = await viewEmployeeRepository.getEmployees(conditions);		
		
		res.send({	
			"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": data, 
		});
	}
	catch(err){ next(err); }	
};

/**
 * 取得(在職)部門員工列表
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @see /api/staff/employees/read/valid_employee_in_dept
 */
module.exports.selectValidEmployeesInDept = async (req, res, next) => {
	try
	{
		const messageHandler = require("../../helper/MessageHandler");
		const viewEmployeeRepository = require("../../repositories/system_base/ViewEmployeeRepository");

		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));

		// setup conditions
		let conditions = {
			"Dept_No": req.body.data.dept_no,
			"Emp_Sta": "N",
		};

		// get data
		const data = await viewEmployeeRepository.getEmployees(conditions);		
		
		res.send({	
			"code": (data.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
			"data": data, 
		});
	}
	catch(err){ next(err); }
};
		
