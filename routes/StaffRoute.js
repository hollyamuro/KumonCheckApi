/**
 * 員工用路由
 * @module routes/StaffRoute
 * 
 * log: 2018/07/06 009727 增加功能項F05 後端發送邀請函
 */

"use strict";

/**
 * 員工後台功能路由
 * cust/read 取得所有客戶主檔資料
 * cust/create 建置客戶主檔，並發送認證信
 * cust/delete 刪除指定客戶主檔資料
 * @param  {} app
 */
module.exports = (app) => {

	const deptService = require("../services/system_base/DeptService");
	app.route("/api/staff/depts/read").post(deptService.selectDeptsInDepts);   

	const employeeService = require("../services/system_base/EmployeeService");
	app.route("/api/staff/employees/read/valid_employees").post(employeeService.selectAllValidEmployees);   
	app.route("/api/staff/employees/read/valid_employees_in_dept").post(employeeService.selectValidEmployeesInDept);   

	const userService = require("../services/system_base/UserService");
	app.route("/api/staff/users/read").post(userService.selectAllUsers);   
	app.route("/api/staff/users/create").post(userService.insertUser);   
	app.route("/api/staff/users/delete").post(userService.deleteUser);   
	app.route("/api/staff/users/login").post(userService.login);
	app.route("/api/staff/users/verify").post(userService.verify);   

	const groupService = require("../services/system_base/GroupService");
	app.route("/api/staff/groups/read").post(groupService.selectAllGroups);
	app.route("/api/staff/groups/create").post(groupService.insertGroup);
	app.route("/api/staff/groups/delete").post(groupService.deleteGroup);
	app.route("/api/staff/groups/update").post(groupService.updateGroup);

	const groupUserService = require("../services/system_base/GroupUserService");
	app.route("/api/staff/group_users/read").post(groupUserService.selectUsersInGroup);
	app.route("/api/staff/group_users/create").post(groupUserService.insertGroupUser);
	app.route("/api/staff/group_users/delete").post(groupUserService.deleteGroupUser);

	const groupPermissionService = require("../services/system_base/GroupPermissionService");
	app.route("/api/staff/group_permissions/read").post(groupPermissionService.getAllGroupPermissions);
	app.route("/api/staff/group_permissions/create").post(groupPermissionService.insertGroupPermissions);
	app.route("/api/staff/group_permissions/delete").post(groupPermissionService.deleteGroupPermissions);   

	const custGroupService = require("../services/CustGroupService");
	app.route("/api/staff/cust_groups/read").post(custGroupService.selectAllCustGroups);
	app.route("/api/staff/cust_groups/create").post(custGroupService.insertCustGroup);
	app.route("/api/staff/cust_groups/delete").post(custGroupService.deleteCustGroup);
	app.route("/api/staff/cust_groups/update").post(custGroupService.updateCustGroup);

	const custGroupUserService = require("../services/CustGroupUserService");
	app.route("/api/staff/cust_group_users/read").post(custGroupUserService.selectCustsInGroup);
	app.route("/api/staff/cust_group_users/create").post(custGroupUserService.insertCustGroupUser);
	app.route("/api/staff/cust_group_users/delete").post(custGroupUserService.deleteCustGroupUser);

	const custGroupPermissionService = require("../services/CustGroupPermissionService");
	app.route("/api/staff/cust_group_permissions/read").post(custGroupPermissionService.getAllCustGroupPermissions);
	app.route("/api/staff/cust_group_permissions/create").post(custGroupPermissionService.insertCustGroupPermissions);
	app.route("/api/staff/cust_group_permissions/delete").post(custGroupPermissionService.deleteCustGroupPermission);   
	
	const custService = require("../services/CustService");
	app.route("/api/staff/custs/read").post(custService.selectAllCusts);
	app.route("/api/staff/custs/import").post(custService.importAllCusts);

	const CustAccountService = require("../services/CustAccountService");
	app.route("/api/staff/custs/invite").post(CustAccountService.inviteCust);
	app.route("/api/staff/custs/reset_password").post(CustAccountService.resetPassword);
};
