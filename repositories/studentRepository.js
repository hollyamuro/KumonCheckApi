/**
 * student 之資料存取層 
 * @module repository/studentRepository
 */

"use strict";

/**
 * 檢查指定條件學生是否存在。
 * @param  {Object} conditions 查詢條件，eg:  { "ID": EM ID },
 * @return {Boolean} 如果客戶帳號存在，為true，反之false。
 */
module.exports.isStudentExisted = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const StudentModule = require("../modules/studentModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return StudentModule.findAll({
						where: conditions,
						raw: true,
					});
				})
				.then((r) => { resolve((r.length === 0) ? false: true); })
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 取得Student 客戶列表內容。
 * @param  {Object} conditions 查詢條件，eg: { "ID":ID },
 * @return {Array.<Object>} 取得之客戶資料。
 */
module.exports.getStudent = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const StudentModule = require("../modules/studentModule");
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return StudentModule.findAll({
						attributes: 
						[
							["ID", 	"ID"], 
							["office", "office"], 
							["name", "name"], 
							["name_en", "name_en"], 
							["birth", "birth"], 
							["sex", "sex"], 
							["address", 	"address"], 
							["email", "email"], 
							["phone", "phone"], 
							["mobile", "mobile"], 
							["parent", "parent"], 
							["class_date", "class_date"], 
							["class_time", 	"class_time"], 
							["class_type", "class_type"], 
							["class_level", "class_level"], 
							["create_date", "create_date"], 
							["edit_date", "edit_date"], 
							["edit_user", "edit_user"], 
						],
						where: conditions,
						order: ["ID"],
						raw: true,
					});
				})
				.then((r) => { 
					for(let i = 0; i < r.length; i++){
						r[i].ID	= r[i].ID.trim();
						r[i].office 	= r[i].office.trim();
						r[i].name 		    = r[i].name.trim();
						r[i].name_en 	= r[i].name_en;
						r[i].birth 		= r[i].birth.trim();
						r[i].sex 	= r[i].sex.trim();
						r[i].address		= r[i].address;
						r[i].email 	= r[i].email.trim();
						r[i].phone 		    = r[i].phone.trim();
						r[i].mobile 	= r[i].mobile.trim();
						r[i].parent 		= r[i].parent.trim();
						r[i].class_date 	= r[i].class_date.trim();
						r[i].class_time		= r[i].class_time.trim();
						r[i].class_type 	= r[i].class_type.trim();
						r[i].class_level 		    = r[i].class_level.trim();
						r[i].create_date 	= r[i].create_date.trim();
						r[i].edit_date 		= r[i].edit_date.trim();
						r[i].edit_user 	= r[i].edit_user.trim();
					}
					resolve(r); 
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};


/**
 * 取得指定條件的使用者。
 * @param  {Object} attributes 顯示欄位，eg: [["account_no", "c_account_no"],]。
 * @param  {Object} condition 查詢條件，eg: { "account_no: c_account_no }。
 */

module.exports.getEmployee = (attributes, conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const CustModule = require("../modules/CustModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return CustModule.findAll({
						attributes: attributes,
						where: conditions,
						raw: true,
					});
				})
				.then((r) => { resolve(r); })
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 取的客戶資料與客戶帳號狀態
 * @param  {Object} conditions 搜尋條件
 */
module.exports.getCustDetail = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const CustModule = require("../modules/CustModule");
		const CustAccountModule = require("../modules/CustAccountModule");

		//associations
		CustModule.hasMany(CustAccountModule, { foreignKey: "account",  sourceKey: "account_no", });
		CustAccountModule.belongsTo(CustModule, { foreignKey: "account",  targetKey: "account_no", });

		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return CustModule.findAll({
						attributes: 
						[
							["account_no", 		"c_account_no"], 
							["account_name", 	"c_account_name"], 
							["sino_account", 	"c_sino_account"], 
							["email", 			"c_email"], 
							["acc_status", 		"c_acc_status"], 
							["acc_type", 		"c_acc_type"], 
						],
						order: ["account_no"],
						where: conditions,
						raw: true,
						include: [
							{   model: CustAccountModule, 
								attributes: [ ["status", "ca_status" ] ],
								where: {
									[ormDB.op.and]: ormDB.sequelize.where(
										ormDB.sequelize.col("Employee.sino_account"), 
										ormDB.sequelize.col("Cust_Account.sino_account")
									),
								},
								required: false,
							},
						]
					});
				})
				.then((r) => { 
					for(let i = 0; i < r.length; i++){
						r[i].ca_status = r[i]["Cust_Account.ca_status"] || "N";
						delete r[i]["Cust_Account.ca_status"];
					}
					resolve(r); 
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 新增(匯入)使用者
 * @param  {Array.<Object>} Employee 客戶資料
 */
module.exports.createEmployee = (Employee) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const CustModule = require("../modules/CustModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction((t)=>{
						let promises = [];

						for(let i=0; i<Employee.length; i++){
							promises.push(CustModule.create(Employee[i], {transaction: t, }));
						}

						return Promise.all(promises)
							.then(() =>{ resolve(); })
							.catch((err) => { reject(err); }); 
					});
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 刪除使用者
 * @param  {Object} conditions 刪除條件
 */
module.exports.destroyEmployee = (conditions) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const CustModule = require("../modules/CustModule");
		
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {  
					return ormDB.KumonCheckINWeb.transaction(function (t) {
						return CustModule.destroy({ where: conditions, transaction: t, })
							.then(() => { resolve(); })
							.catch((err) => { throw(err); }); 
					});
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){
		throw(err);
	}
};

/**
 * 取得使用者所屬群組之權限
 * @param  {String} account_no 帳號
 * @param  {String} sino_account 子帳號
 * @return {Array.<Object>} 權限列表
 */
module.exports.getPermissionsOfCust = (account_no, sino_account) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
		const custGroupUserModule = require("../modules/CustGroupUserModule");
		const custGroupPermissionsModule = require("../modules/CustGroupPermissionsModule");

		//set associations
		custGroupModule.hasMany(custGroupUserModule, { foreignKey: "Group_Id",  sourceKey: "Id", });
		custGroupUserModule.belongsTo(custGroupModule, { foreignKey: "Group_Id",  targetKey: "Id", });

		custGroupModule.hasMany(custGroupPermissionsModule, { foreignKey: "Group_Id",  sourceKey: "Id", });
		custGroupPermissionsModule.belongsTo(custGroupModule, { foreignKey: "Group_Id",  targetKey: "Id", });
	
		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupModule.findAll({
						attributes: [],
						raw: true,
						include: [
							{   model: custGroupUserModule, 
								attributes: [],
								required: true,
								where: {
									"Account_No": account_no,
									"Sino_Account": sino_account,
								}
							},
							{   model: custGroupPermissionsModule, 
								required: true,
							},
						],
					});
				})
				.then((r) => { 
					r.sort((a, b)=>{
						let keyA = 	a["Cust_Group_Permissions.System_Id"]+
									a["Cust_Group_Permissions.Directory_Id"]+
									a["Cust_Group_Permissions.Function_Id"];
						
						let keyB = 	b["Cust_Group_Permissions.System_Id"]+
									b["Cust_Group_Permissions.Directory_Id"]+
									b["Cust_Group_Permissions.Function_Id"];

						return (keyA === keyB)? 0 : ((keyA > keyB)?1:-1);
					});

					let permission = {};
					r.map((p)=>{
						let key = 	p["Cust_Group_Permissions.System_Id"]+
									p["Cust_Group_Permissions.Directory_Id"]+
									p["Cust_Group_Permissions.Function_Id"];
			
						if(!permission.hasOwnProperty(key)){
							permission[key]	={
								"System_Id": 	p["Cust_Group_Permissions.System_Id"],
								"Directory_Id": p["Cust_Group_Permissions.Directory_Id"],
								"Function_Id": 	p["Cust_Group_Permissions.Function_Id"],
								"Auth": [],								
							};
						}
						permission[key].Auth.push(p["Cust_Group_Permissions.Auth"]);
					});
				
					resolve(Object.values(permission));
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){ throw(err); }
};

/**
 * 取得使用者所屬群組之角色
 * @param  {String} account_no 帳號
 * @param  {String} sino_account 子帳號
 * @return {Array.<String>} 角色列表
 */
module.exports.getRolesOfCust = (account_no, sino_account) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
		const custGroupUserModule = require("../modules/CustGroupUserModule");

		//set associations
		custGroupModule.hasMany(custGroupUserModule, { foreignKey: "Group_Id",  sourceKey: "Id", });
		custGroupUserModule.belongsTo(custGroupModule, { foreignKey: "Group_Id",  targetKey: "Id", });

		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupModule.findAll({
						raw: true,
						include: [
							{   model: custGroupUserModule, 
								attributes: [],
								required: true,
								where: {
									"Account_No": account_no,
									"Sino_Account": sino_account,
								}
							},
						],
					});
				})
				.then((r) => { 
					let roles = {};
					r.map((role)=>{ 
						if(role.Role && role.Role!=="") roles[role.Role] = true; 
					});
					resolve(Object.keys(roles));
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){ throw(err); }
};

/**
 * 取得使用者所屬群組之商品別
 * @param  {String} account_no 帳號
 * @param  {String} sino_account 子帳號
 * @return {Array.<String>} 商品別列表
 */
module.exports.getProductsOfCust = (account_no, sino_account) => {
	try
	{
		const ormDB = require("../helper/OrmDB");
		const custGroupModule = require("../modules/CustGroupModule");
		const custGroupUserModule = require("../modules/CustGroupUserModule");

		//set associations
		custGroupModule.hasMany(custGroupUserModule, { foreignKey: "Group_Id",  sourceKey: "Id", });
		custGroupUserModule.belongsTo(custGroupModule, { foreignKey: "Group_Id",  targetKey: "Id", });

		return new Promise( (resolve, reject ) => {
			ormDB.KumonCheckINWeb.authenticate()
				.then(() => {    
					return custGroupModule.findAll({
						raw: true,
						include: [
							{   model: custGroupUserModule, 
								attributes: [],
								required: true,
								where: {
									"Account_No": account_no,
									"Sino_Account": sino_account,
								}
							},
						],
					});
				})
				.then((r) => { 
					let products = {};
					r.map((p)=>{ 
						if(p.Product && p.Product!=="") products[p.Product] = true; 
					});
					resolve(Object.keys(products));
				})
				.catch((err) => { reject(err); }); 
		});
	}
	catch(err){ throw(err); }
};

