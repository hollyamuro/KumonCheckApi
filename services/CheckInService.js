/**
 * 2019/04/05 009727  
 * student 相關之邏輯
 * @module services/CheckInservice
 */

"use strict";
/**
 * 學生打卡
 * @param  {} req 輸入data{"ID:"客戶帳號","office":"所在教室","token":"登入Token"}，requester{EM_Account}
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "verify test ok" }
 * @param  {} next 無
 * @see /api/service/checkin
 */
module.exports.checkin =  async (req, res, next) => 
{
	const nodemailer = require('nodemailer');
	const axios = require("axios");
	const messageHandler = require("../helper/MessageHandler");
	const CheckInRepository=require("../repositories/checkinRepository");
	const EmployeeRepository = require("../repositories/employeeRepository");
	const StudentRepository = require("../repositories/studentRepository");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const debug = require("debug")("KumonCheckINApi:CheckInService.checkin");
	const config = require("../Config");
	const utility=require("../helper/Utility");
	const dateFormat = require("date-format");
	const mailjson=require("../helper/KumonCheckInMail");
	const crypto = require("crypto");
	// check parameters
	if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
	if(!req.body.hasOwnProperty("requester") || req.body.requester === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
	if(!req.body.data.hasOwnProperty("ID") || req.body.data.ID === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
	if(!req.body.data.hasOwnProperty("office") || req.body.data.office === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
	if(!req.body.data.hasOwnProperty("token") || req.body.data.token === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
	//prepare data
	let strtoday = dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
	let checkinconditions={"date":strtoday,"ID":req.body.data.ID,'office':req.body.data.office,"type":"kumon"};//學生預設kumon，employee則抓type欄位
	try{
		//check login
		let bllogin=await EmpAccountRepository.isEmpAccountsExisted({"token":req.body.data.token});
		if(bllogin==false)
		{
			throw(new Error("ERROR_TOKEN_NOT_FOUND"));
		}
		let empaccount=await EmpAccountRepository.getEmp_Account({"token":req.body.data.token});
		let dtexpire=new Date(empaccount[0].expire.toString());
		if(dtexpire<Date.now())
		{
			throw(new Error("ERROR_TOKEN_EXPIRED"));
		}
		//get Id's type
		let strType=req.body.data.ID.substr(0,2);
		let blExsist=false;
		let blHasClass=false;
		let userdata={};
		if(strType=="ST")//學生 StudentRepository
		{
			debug("學生"+strType);
			blExsist=await StudentRepository.isStudentExisted({"ID":req.body.data.ID});
			if(blExsist==false)
			{
				throw(new Error("ERROR_WRONG_ACCOUNT"));
			}
			userdata=await StudentRepository.getStudent({"ID":req.body.data.ID});
		}
		else if(strType="EM")//員工 EmployeeRepository
		{
			debug("員工"+strType);
			blExsist=await EmployeeRepository.isEmployeeExisted({"ID":req.body.data.ID})
			if(blExsist==false)
			{
				throw(new Error("ERROR_WRONG_ACCOUNT"));
			}
			userdata=await EmployeeRepository.getEmployee({"ID":req.body.data.ID});
			checkinconditions.type=userdata.type.toString();
		}
		//check是否今日有打卡登入 
		blHasClass=await CheckInRepository.isCheckInExisted(checkinconditions);
		if(blHasClass==false)
		{
			throw(new Error("ERROR_NOT_FOUND"));	
		}
		let conditions_checkin=[{"key":"date","operator":"=","value":dateFormat.asString("yyyy/MM/dd", new Date())},
			{"key":"ID","operator":"=","value":req.body.data.ID},
			{"key":"office","operator":"=","value":req.body.data.office}];
		let value_checkin={"datetime":dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date()),
							"office":req.body.data.office,
							"editor":req.body.requester}
		let blCheckSuccess=await CheckInRepository.CheckIn(conditions_checkin,value_checkin);
		if(blCheckSuccess==false)
		{
			throw(new Error("ERROR_ACTION_Fail"));	
		}
		let maillist=mailjson.adminEmail();
		let CheckInmail_json=[];
		for(let i=0;i<maillist.length;i++)
		{
			CheckInmail_json.push(mailjson.CheckInmail(maillist[i],req.body.data.ID,""));
		}
		let mailTransport = nodemailer.createTransport({
			host:config[process.env.NODE_ENV].Cust_MailServer.host, 
			port: config[process.env.NODE_ENV].Cust_MailServer.port,
			secure:true,
			auth: {
				user: config[process.env.NODE_ENV].Cust_MailServer.user,
				pass: config[process.env.NODE_ENV].Cust_MailServer.password
			}
			});
		debug("寄送郵件");
		for(let i=0;i<CheckInmail_json.length;i++)
		{
			await mailTransport.sendMail(CheckInmail_json[i], (error, info) => 
			{
				if (error) {
					return console.log(error);
					throw(new Error("ERROR_SEND_MAIL"));
				}
				debug("寄送郵件 成功");
			});
		}
		res.send({  
			"code" : messageHandler.infoHandler("INFO_TOKEN_SUCCESS"), 
			"data": "打卡成功",
		});
			
	}
	catch(err){
		debug("打卡失敗"+err)
		next(err); 
	} 
};

/**
 * 產生今日打卡內容
 * @param  {} req 輸入data{"date":"日期，不代則抓本日","office":"所在教室，不代則產全部","force":true/false 是否強迫重產}，requester{EM_Account}
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "verify test ok" }
 * @param  {} next 無
 * @see /api/service/buildcheckin
 */
module.exports.buildcheckin =  async (req, res, next) => 
{
	const nodemailer = require('nodemailer');
	const axios = require("axios");
	const messageHandler = require("../helper/MessageHandler");
	const CheckInRepository=require("../repositories/checkinRepository");
	const EmployeeRepository = require("../repositories/employeeRepository");
	const StudentRepository = require("../repositories/studentRepository");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const debug = require("debug")("KumonCheckINApi:CheckInService.buildcheckin");
	const config = require("../Config");
	const utility=require("../helper/Utility");
	const dateFormat = require("date-format");
	const mailjson=require("../helper/KumonCheckInMail");
	const crypto = require("crypto");
	// check parameters
	if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
	if(!req.body.hasOwnProperty("requester") || req.body.requester === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
	//prepare data
	let strtoday = dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
	if (req.body.data.hasOwnProperty(date))
	{
		Date.tryp
	}
	let checkinconditions={"date":strtoday,"ID":req.body.data.ID,'office':req.body.data.office,"type":"kumon"};//學生預設kumon，employee則抓type欄位
	try{
		//check login
		let bllogin=await EmpAccountRepository.isEmpAccountsExisted({"token":req.body.data.token});
		if(bllogin==false)
		{
			throw(new Error("ERROR_TOKEN_NOT_FOUND"));
		}
		let empaccount=await EmpAccountRepository.getEmp_Account({"token":req.body.data.token});
		let dtexpire=new Date(empaccount[0].expire.toString());
		if(dtexpire<Date.now())
		{
			throw(new Error("ERROR_TOKEN_EXPIRED"));
		}
		//get Id's type
		let strType=req.body.data.ID.substr(0,2);
		let blExsist=false;
		let blHasClass=false;
		let userdata={};
		if(strType=="ST")//學生 StudentRepository
		{
			debug("學生"+strType);
			blExsist=await StudentRepository.isStudentExisted({"ID":req.body.data.ID});
			if(blExsist==false)
			{
				throw(new Error("ERROR_WRONG_ACCOUNT"));
			}
			userdata=await StudentRepository.getStudent({"ID":req.body.data.ID});
		}
		else if(strType="EM")//員工 EmployeeRepository
		{
			debug("員工"+strType);
			blExsist=await EmployeeRepository.isEmployeeExisted({"ID":req.body.data.ID})
			if(blExsist==false)
			{
				throw(new Error("ERROR_WRONG_ACCOUNT"));
			}
			userdata=await EmployeeRepository.getEmployee({"ID":req.body.data.ID});
			checkinconditions.type=userdata.type.toString();
		}
		//check是否今日有打卡登入 
		blHasClass=await CheckInRepository.isCheckInExisted(checkinconditions);
		if(blHasClass==false)
		{
			throw(new Error("ERROR_NOT_FOUND"));	
		}
		let conditions_checkin=[{"key":"date","operator":"=","value":dateFormat.asString("yyyy/MM/dd", new Date())},
			{"key":"ID","operator":"=","value":req.body.data.ID},
			{"key":"office","operator":"=","value":req.body.data.office}];
		let value_checkin={"datetime":dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date()),
							"office":req.body.data.office,
							"editor":req.body.requester}
		let blCheckSuccess=await CheckInRepository.CheckIn(conditions_checkin,value_checkin);
		if(blCheckSuccess==false)
		{
			throw(new Error("ERROR_ACTION_Fail"));	
		}
		let maillist=mailjson.adminEmail();
		let CheckInmail_json=[];
		for(let i=0;i<maillist.length;i++)
		{
			CheckInmail_json.push(mailjson.CheckInmail(maillist[i],req.body.data.ID,""));
		}
		let mailTransport = nodemailer.createTransport({
			host:config[process.env.NODE_ENV].Cust_MailServer.host, 
			port: config[process.env.NODE_ENV].Cust_MailServer.port,
			secure:true,
			auth: {
				user: config[process.env.NODE_ENV].Cust_MailServer.user,
				pass: config[process.env.NODE_ENV].Cust_MailServer.password
			}
			});
		debug("寄送郵件");
		for(let i=0;i<CheckInmail_json.length;i++)
		{
			await mailTransport.sendMail(CheckInmail_json[i], (error, info) => 
			{
				if (error) {
					return console.log(error);
					throw(new Error("ERROR_SEND_MAIL"));
				}
				debug("寄送郵件 成功");
			});
		}
		res.send({  
			"code" : messageHandler.infoHandler("INFO_TOKEN_SUCCESS"), 
			"data": "打卡成功",
		});
			
	}
	catch(err){
		debug("打卡失敗"+err)
		next(err); 
	} 
};


/**
 * 確認客戶資料，比對是否已經存在，新增客戶主檔，並寄送邀請信。
 * @param  {} req 輸入data(客戶帳號，sino帳號)，requester(邀請的員工工號) 
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "verify test ok" }
 * @param  {} next 無
 * @see /api/staff/custs/create
 */
module.exports.inviteCust = async (req, res, next) => 
{	
	try
	{
		const messageHandler = require("../helper/MessageHandler");
		const CustRepository = require("../repositories/CustRepository");
		const EmpAccountRepository = require("../repositories/EmpAccountRepository");
		const uuidV1 = require("uuid/v1");
		const debug = require("debug")("KumonCheckINApi:CustAccountService.inviteCust");
		const config = require("../Config");
		const axios = require("axios");
		const mailjson=require("../helper/KumonCheckInMail");
		let dateFormat = require("date-format");
		const utility=require("../helper/Utility");
		const crypto = require("crypto");
		const attributes=
		[
			["account_no", 	"account_no"], 
			["account_name", "account_name"], 
			["sino_account", "sino_account"], 
			["email", "email"], 
			["acc_status", "acc_status"], 
			["acc_type", "acc_type"], 
		];
		//prepare data
		const cust_mailapi = config[process.env.NODE_ENV].Cust_MailServer.policy + "://" + 
						config[process.env.NODE_ENV].Cust_MailServer.host + ":" + config[process.env.NODE_ENV].Cust_MailServer.port+"/"+config[process.env.NODE_ENV].Cust_MailServer.api;
		let salt = uuidV1(); 
		let custurl = config[process.env.NODE_ENV].KumonCheckINCustWeb.policy + "://" + 
						config[process.env.NODE_ENV].KumonCheckINCustWeb.domain+ "/verify="+salt;
		let strtoday=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
		// let strexpire_date=utility.setDate(new Date(),"yyyy/MM/dd hh:mm:ss",0,1,0,0);
		let strexpire_date=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date((new Date().setDate(new Date().getDate()+1))));
		// let strexpire_date=dateFormat.asString("yyyy/MM/dd hh:mm:ss", (new Date().getDate()+1));
		let RandomPW = crypto.randomBytes(16).toString("base64").substr(0, 16);
		let RandomPWSalt = crypto.randomBytes(16).toString("base64").substr(0, 16);
		debug(strexpire_date);
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester") || req.body.requester === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("account_no") || req.body.data.account_no === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("sino_account")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// setup conditions
			let conditions = { "account_no":req.body.data.account_no ,"sino_account":req.body.data.sino_account };
			let conditions_account = { "account":req.body.data.account_no ,"sino_account":req.body.data.sino_account };
			// check existed
			const isCustsExisted = await CustRepository.isCustsExisted(conditions);
			const isCust_AccountExisted = await EmpAccountRepository.isEmpAccountsExisted(conditions_account);
			let CheckPass=true;
			if(!isCustsExisted)
			{
				CheckPass=false;
				res.send({	
					//"code": (dataCust.length === 0) ? messageHandler.infoHandler("INFO_NO_DATA") : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
					"code": messageHandler.infoHandler("INFO_NOT_EXISTED_USER"),
					"data": [], 
				});
			}
			// get Custs Data
			const dataCust = await CustRepository.getCusts(attributes,conditions);	
			debug(dataCust);	
			//get Cust_Account Data
			if(dataCust[0].email=="")
			{
				CheckPass=false;
				res.send({	
					"code": messageHandler.infoHandler("INFO_NO_EMAIL"),
					"data": [], 
				});
			}
			else if(dataCust[0].acc_status!=="1")
			{
				CheckPass=false;
				res.send({
					"code": messageHandler.errorHandler(new Error("ERROR_ACCOUNT_STATUS_0")),
					"data": [], 
				});
			}
			let invite_mail_json=mailjson.invitemail(dataCust[0].email,dataCust[0].account_no,custurl);
			//invite_mail_json.receivers=dataCust[0].email;

			if(!isCust_AccountExisted && CheckPass)
			{
				// perpare Cust_Account
				// 2018/08/08 新增 account hash
				let bytes=[] ;
				let accountchar;
				let accountsalt=utility.randomNumber(9999999999999999);
				let account_id=dataCust[0].account_no;
				let accounthash="";
				for (let i = 0; i < account_id.length; ++i) 
				{
					accountchar = account_id.charCodeAt(i);
					bytes = bytes.concat(Math.round([accountchar/9999999999999999*accountsalt]));
					//debug("password Char "+i+" ="+accountchar);
				}
				for(let byte_i=0;byte_i<bytes.length;byte_i++)
				{
					accounthash=accounthash+bytes[byte_i].toString();
				}
				//debug("salt="+accountsalt+"  account_hash="+accounthash);
				let Cust_Account = 
				{
					"account":dataCust[0].account_no,
					"sino_account":dataCust[0].sino_account,
					"password":RandomPW,
					"passwordsalt":RandomPWSalt,
					"accountsalt":accountsalt,
					"accounthash":accounthash,
					"name":dataCust[0].account_name,
					"phone":"",
					"status":"U",
					"url":salt,
					"reset_url":"",
					"count":0,
					"mail_count":0,
					"verify_code":"",
					"url_expire":strexpire_date,
					"reset_url_expire":"",
					"expire_date":"",
					"create_date":strtoday,
					"edit_date":strtoday,
				};
				let create_result = await EmpAccountRepository.createCust_Account(Cust_Account);
				let account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account);
				let create_log_result = await EmpAccountRepository.createCust_Account_Log(account_log);
				await axios.post(cust_mailapi,invite_mail_json).then(
					function (res) 
					{
						let send_mail_result=res.data.toString().trim();
						//if(send_mail_result=== "email error !")
						if(send_mail_result!== "success !")
						{
							throw(new Error("ERROR_SEND_MAIL"));
						}
					});
				res.send({	
					"code": (create_result ===0 &&  create_log_result===0) ? messageHandler.errorHandler(new Error("ERROR_INTERNAL_SERVER_ERROR")) : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
					"data": [], 
				});
			}
			else if(CheckPass)
			{
				// get Cust_Account Data
				const dataCustAccount = await EmpAccountRepository.getCust_Account(conditions_account);	
				if(dataCustAccount[0].status=="U" || dataCustAccount[0].status=="N")
				{
					//UPDATE
					let update_Cust_Account = 
					{
						"status":"U",
						"url":salt,
						"count":0,
						"mail_count":0,
						"verify_code":"",
						"url_expire":strexpire_date,
						"reset_url_expire":"",
						"expire_date":"",
						"create_date":strtoday,
						"edit_date":strtoday,
					};
					const set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_account);
					let Cust_Account_Log = 
					{
						"action_type":"I",
						"action_date":strtoday,
						"action_user":req.body.requester,
						"account":dataCust[0].account_no,
						"sino_account":dataCust[0].sino_account,
						"password":RandomPW,
						"name":dataCust[0].account_name,
						"phone":"",
						"status":"U",
						"url":salt,
						"reset_url":"",
						"count":0,
						"mail_count":0,
						"verify_code":"",
						"url_expire":strexpire_date,
						"reset_url_expire":"",
						"expire_date":"",
						"create_date":strtoday,
						"edit_date":strtoday,
					};
					let create_log_result = await EmpAccountRepository.createCust_Account_Log(Cust_Account_Log);
					debug("send mail"+cust_mailapi+"  "+invite_mail_json.receivers+" \n"+invite_mail_json.content);
					await axios.post(cust_mailapi,invite_mail_json).then(
						function (res) 
						{
							let send_mail_result=res.data.toString().trim();
							//if(send_mail_result=== "email error !")
							if(send_mail_result!== "success !")
							{
								throw(new Error("ERROR_SEND_MAIL"));
							}
						});
					res.send({	
						"code": (set_result ===0 && create_log_result===0) ? messageHandler.errorHandler(new Error("ERROR_INTERNAL_SERVER_ERROR")) : messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
						"data": [], 
					});
				}
				else
				{
					res.send({	
						"code": messageHandler.infoHandler("INFO_USER_ALREADY_ACTIVATED"),
						"data": [], 
					});
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch(err){ next(err); }	
};

/**
 * 確認對應token是否存在。
 * @param  {} { "data":{"type" : "url或reset_url", "token" : "xxxxxxxxxx"},"requester":"128.110.38.159"}
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "Success/Fail/token不存在或輸入錯誤。" }
 * @param  {} next 無
 */
module.exports.url_check= async (req, res, next) =>{
	const messageHandler = require("../helper/MessageHandler");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const debug = require("debug")("KumonCheckINApi:CustAccountService.url_check");
	const utility=require("../helper/Utility");
	try
	{
		//prepare data
		const reset_url="reset_url";
		const url="url";
		let inputtype=req.body.data.type;
		let inputtoken=req.body.data.token;
		let isCustsExisted;
		// check parameters
		debug(req.body);
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("type") || req.body.data.type === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("token") || req.body.data.token === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(!inputtype===reset_url || !inputtype===url)
			{
				debug("type input error "+inputtype);
				throw(new Error("ERROR_URL_NOT_FOUND"));
			}
			if(inputtype===reset_url)
			{
				let conditions_account = { reset_url:inputtoken};
				isCustsExisted = await EmpAccountRepository.isEmpAccountsExisted(conditions_account);
				debug(isCustsExisted);
				if(!isCustsExisted)
				{
					throw(new Error("ERROR_URL_NOT_FOUND"));
				}
				else
				{
					res.send({	
						"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
						"data": [], 
					});
				}
			}
			else
			{
				let conditions_account = { url:inputtoken};
				isCustsExisted = await EmpAccountRepository.isEmpAccountsExisted(conditions_account);
				if(!isCustsExisted)
				{
					throw(new Error("ERROR_URL_NOT_FOUND"));
				}
				else
				{
					res.send({	
						"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
						"data": [], 
					});
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}catch(err){
		next(err);
	}
};

/**
 * 確認客戶資料，並寄送重設密碼信。
 * @param  {} req 輸入data(account,useremail)，requester(連線電腦的ip) 
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "Success/Fail/other" }
 * @param  {} next 無
 */
module.exports.resetPassword = async (req, res, next) =>{
	const messageHandler = require("../helper/MessageHandler");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const CustPwdResetRepository = require("../repositories/CustPwdResetRepository");
	const config=require("../config");
	//const debug = require("debug")("KumonCheckINApi:CustAccountService.resetPassword");
	const axios = require("axios");
	let dateFormat = require("date-format");
	const utility=require("../helper/Utility");
	const mailjson=require("../helper/KumonCheckInMail");
	const uuidV1 = require("uuid/v1");
	try{
		//prepare data
		let salt = uuidV1(); 
		const cust_mailapi = config[process.env.NODE_ENV].Cust_MailServer.policy + "://" + 
			config[process.env.NODE_ENV].Cust_MailServer.host + ":" + config[process.env.NODE_ENV].Cust_MailServer.port+"/"+config[process.env.NODE_ENV].Cust_MailServer.api;
		const service_mailapi = config[process.env.NODE_ENV].local_MailServer.policy + "://" + 
			config[process.env.NODE_ENV].local_MailServer.host + ":" + config[process.env.NODE_ENV].local_MailServer.port+"/"+config[process.env.NODE_ENV].local_MailServer.api;		
		let reset_url = config[process.env.NODE_ENV].KumonCheckINCustWeb.policy + "://" + 
		config[process.env.NODE_ENV].KumonCheckINCustWeb.domain+ "/verify_reset="+salt;
		//let reset_mail_json=mailjson.resetpassmail("temp",reset_url);
		let reset_mail_service_json;
		let status_V="V";
		// let datenow=new Date();
		let strdatenow=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
		let strtoday=dateFormat.asString("yyyy/MM/dd", new Date());
		let strnextdayTime=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date((new Date().setMinutes(new Date().getMinutes()+5))));
		let strnextday=dateFormat.asString("yyyy/MM/dd", new Date((new Date().setDate(new Date().getDate()+1))));
		// let strnextdayTime=utility.setDate(new Date(),"yyyy/MM/dd hh:mm:ss",0,1,0,0);
		// let strnextday=utility.setDate(new Date(),"yyyy/MM/dd",0,1,0,0);
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("useremail") || req.body.data.useremail === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			let inputAccount=req.body.data.account;
			let inputUserEmail=req.body.data.useremail;
			let inputUserIP=req.body.requester;
			let condition_account = [{"key":"account","value":inputAccount},{"key":"email","value":inputUserEmail}];
			let condition_reset = [{"key":"account","operator":"=","value":inputAccount},{"key":"mail","operator":"=","value":inputUserEmail},{"key":"create_date","operator":">=","value":strtoday},{"key":"create_date","operator":"<","value":strnextday}];
			let conditions_update = { "account":"" ,"sino_account":""};
			let set_result;
			let account_log;
			let create_result;
			let create_log_result;
			//阻擋惡意攻擊IP
			let conditions_ip=[{"key":"cust_ip","operator":"=","value":req.body.requester},{"key":"create_date","operator":">=","value":strtoday},{"key":"create_date","operator":"<","value":strnextday}];
			let query_byIp=await CustPwdResetRepository.getCustPwdReset(conditions_ip);
			if(query_byIp.length>=10)
			{
				let new_Reset_Pwd_Log = 
				{
					"account":inputAccount,
					"mail":inputUserEmail,
					"match":0,
					"frequently":1,
					"reset_url":"",
					"cust_ip":inputUserIP,
					"create_date":strdatenow
				};
				await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				let malicious_mail_service_json=mailjson.malicious_mail_service(mailjson.adminEmail(),inputUserIP,inputAccount);
				await axios.post(service_mailapi,malicious_mail_service_json);
				throw(new Error("ERROR_TOO_FREQUENTLY"));
			}
			//check frequency (1 day < 10 times)
			let resetlog=await CustPwdResetRepository.getCustPwdReset(condition_reset);
			if(resetlog.length>=10)
			{
				let new_Reset_Pwd_Log = 
				{
					"account":inputAccount,
					"mail":inputUserEmail,
					"match":0,
					"frequently":1,
					"reset_url":"",
					"cust_ip":inputUserIP,
					"create_date":strdatenow
				};
				await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				let malicious_mail_service_json=mailjson.malicious_mail_service(mailjson.adminEmail(),inputUserIP,inputAccount);
				await axios.post(service_mailapi,malicious_mail_service_json);
				throw(new Error("ERROR_TOO_FREQUENTLY"));
			}
			else
			{
				let cust_account=await EmpAccountRepository.getCust_Account_and_Custs(condition_account);
				if(cust_account.length===0){
					throw(new Error("ERROR_ACCOUNT_NOT_EXISTED"));
				}else if(cust_account[0].status === "U"){
					throw(new Error("ERROR_ACCOUNT_NOT_EXISTED_DATA"));
				}else{
					if(cust_account.length>0)
					{
						//gen verify code and mail json
						let verifycode=utility.randomNumber(99999999).toString();
						let reset_mail_json=mailjson.resetpassmail(inputUserEmail,inputAccount,reset_url);
						reset_mail_json.receivers=inputUserEmail;
						reset_mail_service_json=mailjson.resetpassmail_service(mailjson.adminEmail(),inputAccount,reset_url);
						//Add Reset log
						let new_Reset_Pwd_Log = 
						{
							"account":inputAccount,
							"mail":inputUserEmail,
							"match":1,
							"frequently":0,
							"reset_url":salt,
							"cust_ip":inputUserIP,
							"create_date":strdatenow
						};
						create_result=await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
						//set account status
						let update_Account_value = 
						{
							"status":status_V,
							"reset_url":salt,
							"verify_code":verifycode,
							"mail_count":0,
							"count":0,
							"reset_url_expire":strnextdayTime,
							"edit_date":strdatenow,
						};
						conditions_update.account=inputAccount;
						conditions_update.sino_account=cust_account[0].sino_account;
						set_result = await EmpAccountRepository.set_Cust_Account(update_Account_value,conditions_update);
						for(let INDEX=0;INDEX<cust_account.length;INDEX++)
						{
							account_log=utility.createAccountLog("I",req.body.requester,strdatenow,cust_account[INDEX]);
							create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
						}
						await axios.post(cust_mailapi,reset_mail_json).then(
							function (res) 
							{
								let send_mail_result=res.data.toString().trim();
								//if(send_mail_result=== "email error !")
								if(send_mail_result!== "success !")
								{
									throw(new Error("ERROR_SEND_MAIL"));
								}
							});
						await axios.post(service_mailapi,reset_mail_service_json);
						if(set_result ===0 && create_result===0 && create_log_result===0){
							throw(new Error("ERROR_ACCOUNT_EMAIL_INVALID"));
						}else{
							res.send({	
								"code":	messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
								"data": [], 
							});
						}
					}
					else
					{
						let new_Reset_Pwd_Log = 
						{
							"account":inputAccount,
							"mail":inputUserEmail,
							"match":0,
							"frequently":0,
							"reset_url":"",
							"cust_ip":inputUserIP,
							"create_date":strdatenow
						};
						await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
						throw(new Error("ERROR_NOT_EXISTED_DATA"));
					}
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}catch(err){
		next(err);
	}
};

/**
 * 確認客戶帳號資料，比對是否信箱與邀請函匹配。
 * @param  {} req data(type(是註冊或重設密碼的token),客戶email，token)，requester(連線電腦的ip) 
 * @param  {} res 回傳 { "code" : { "type": "xxx", "message":"xxxxx" }, "data" :  "Success/Fail" }
 * @param  {} next 無
 */
module.exports.matching = async (req, res, next) => 
{
	const messageHandler = require("../helper/MessageHandler");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	//const debug = require("debug")("KumonCheckINApi:CustAccountService.matching");
	const config = require("../Config");
	const axios = require("axios");
	let dateFormat = require("date-format");
	const utility=require("../helper/Utility");
	const mailjson=require("../helper/KumonCheckInMail");
	try{
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("useremail") || req.body.data.useremail === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("token") || req.body.data.token === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("type") || req.body.data.type === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			//prepare data
			const mailapi = config[process.env.NODE_ENV].Cust_MailServer.policy + "://" + 
			config[process.env.NODE_ENV].Cust_MailServer.host + ":" + config[process.env.NODE_ENV].Cust_MailServer.port+"/"+config[process.env.NODE_ENV].Cust_MailServer.api;
			let datenow=new Date();
			let strtoday=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
			// let strexpire_date=utility.setDate(new Date(),"yyyy/MM/dd hh:mm:ss",0,1,0,0);
			let strexpire_date=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date((new Date().setMinutes(new Date().getMinutes()+5))));
			let inputmail=req.body.data.useremail;
			let inputToken=req.body.data.token;
			let condition = [{"key":req.body.data.type,"value":inputToken}];
			let conditions_update = { "account":"" ,"sino_account":""};
			//select by token and mail 
			let Cust_Account=await EmpAccountRepository.getCust_Account_and_Custs(condition);
			let account_log;
			let set_result;
			let create_log_result;
			if(Cust_Account.length<1)
			{
				throw(new Error("ERROR_URL_NOT_FOUND"));
			}
			else
			{
				if(Cust_Account.length<1||Cust_Account.length>1)
				{
					//UPDATE token/mail pair count and savelog
					for(let index=0;index<Cust_Account.length;index++)
					{
						Cust_Account[index].mail_count=Cust_Account[index].mail_count+1;
						let update_Cust_Account = 
						{
							"mail_count":0,
							"edit_date":strtoday,
						};
						conditions_update.account=Cust_Account[index].account;
						conditions_update.sino_account=Cust_Account[index].sino_account;
						update_Cust_Account.mail_count=Cust_Account[index].mail_count;
						set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
						let account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account[index]);
						await EmpAccountRepository.createCust_Account_Log(account_log);
					}
					throw(new Error("ERROR_EMAIL_UNMATCH_MUCH"));
				}
				else if(Cust_Account[0].mail_count>2)
				{
					Cust_Account[0].verify_code="";
					Cust_Account[0].url="";
					let update_Cust_Account = 
					{
						"url":"",
						"reset_url":"",
						"verify_code":"",
						"edit_date":strtoday,
					};
					conditions_update.account=Cust_Account[0].account;
					conditions_update.sino_account=Cust_Account[0].sino_account;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account[0]);
					await EmpAccountRepository.createCust_Account_Log(account_log);
					throw(new Error("ERROR_EMAIL_URL_MATCH_THREE_TIME"));
				}
				else if(Cust_Account[0].email!=inputmail)
				{
					Cust_Account[0].mail_count=Cust_Account[0].mail_count+1;
					let update_Cust_Account = 
					{
						"mail_count":0,
						"edit_date":strtoday,
					};
					conditions_update.account=Cust_Account[0].account;
					conditions_update.sino_account=Cust_Account[0].sino_account;
					update_Cust_Account.mail_count=Cust_Account[0].mail_count;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					let account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account[0]);
					await EmpAccountRepository.createCust_Account_Log(account_log);
					throw(new Error("ERROR_EMAIL_UNMATCH"));
				}
				else if(typeof(Cust_Account[0].url_expire)!=undefined && Cust_Account[0].url_expire!="")
				{
					let url_expired_date;
					let invite_mail_json;
					let verifycode=utility.randomNumber(99999999).toString();
					if(req.body.data.type=="url")
					{
						url_expired_date=new Date(Cust_Account[0].url_expire);
						invite_mail_json=mailjson.verifycodemail(Cust_Account[0].email,Cust_Account[0].account,verifycode);
					}
					else
					{
						url_expired_date=new Date(Cust_Account[0].reset_url_expire);
						invite_mail_json=mailjson.resetverifycodemail(Cust_Account[0].email,Cust_Account[0].account,verifycode);
					}
					if(datenow>url_expired_date)
					{
						throw(new Error("ERROR_TOKEN_EXPIRED"));
					}
					else 
					{
						conditions_update = { "account":Cust_Account[0].account ,"sino_account":Cust_Account[0].sino_account};
						Cust_Account[0].verify_code=verifycode;
						Cust_Account[0].expire_date=strexpire_date;
						Cust_Account[0].url="";
						Cust_Account[0].mail_count=Cust_Account[0].mail_count+1;
						//UPDATE the uniq user
						let update_Account_value = 
						{
							"url":"",
							"verify_code":verifycode,
							"mail_count":Cust_Account[0].mail_count,
							"edit_date":strtoday,
							"expire_date":strexpire_date,
						};
						set_result = await EmpAccountRepository.set_Cust_Account(update_Account_value,conditions_update);
						account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account[0]);
						create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
						await axios.post(mailapi,invite_mail_json).then(
							function (res) 
							{
								let send_mail_result=res.data.toString().trim();
								//if(send_mail_result=== "email error !")
								if(send_mail_result!== "success !")
								{
									throw(new Error("ERROR_SEND_MAIL"));
								}
							});
						if(set_result ===0 && create_log_result===0){
							throw(new Error("ERROR_EMAIL_INVALID"));
						}else{
							res.send({	
								"code":	messageHandler.infoHandler("INFO_READ_EMAIL_SUCCESS"), 
							});
						}
					}
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}catch(err){
		next(err);
	}
};
/**
* 確認客戶驗證碼，並開通帳戶，以及回傳重設密碼的url。
 * @param  {} req 輸入data(type[初始化/重設密碼],email，verify code,token)，requester(連線電腦的ip) 
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" : {"type":"reset_url","token":"6c8f1e90-864e-11e8-888a-b521bdbe25b0"} }
 * @param  {} next 無
 */
module.exports.verify = async (req, res, next) => 
{
	const messageHandler = require("../helper/MessageHandler");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const debug = require("debug")("KumonCheckINApi:CustAccountService.verify");
	const config = require("../Config");
	// const axios = require("axios");
	let dateFormat = require("date-format");
	const utility=require("../helper/Utility");
	const uuidV1 = require("uuid/v1");
	const mailjson=require("../helper/KumonCheckInMail");
	const axios = require("axios");
	try{
		//prepare data
		const cust_mailapi = config[process.env.NODE_ENV].Cust_MailServer.policy + "://" + 
			config[process.env.NODE_ENV].Cust_MailServer.host + ":" + config[process.env.NODE_ENV].Cust_MailServer.port+"/"+config[process.env.NODE_ENV].Cust_MailServer.api;
		const service_mailapi = config[process.env.NODE_ENV].local_MailServer.policy + "://" + 
			config[process.env.NODE_ENV].local_MailServer.host + ":" + config[process.env.NODE_ENV].local_MailServer.port+"/"+config[process.env.NODE_ENV].local_MailServer.api;
		let datenow=new Date();
		// let strnextdayTime=utility.setDate(new Date(),"yyyy/MM/dd hh:mm:ss",0,1,0,0);
		let strnextdayTime=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date((new Date().setDate(datenow.getDate()+1))));
		let strtoday=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
		let salt = uuidV1(); 
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("useremail") || req.body.data.useremail === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("verifycode") || req.body.data.verifycode === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("type") || req.body.data.type === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			let inputmail=req.body.data.useremail;
			let inputCode=req.body.data.verifycode;
			let condition = [{"key":"email","value":inputmail}];
			let conditions_update = { "account":"" ,"sino_account":""};
			//select by email
			let Cust_Account=await EmpAccountRepository.getCust_Account_and_Custs(condition);
			let Cust_Account_Verify;
			let account_log;
			let set_result;
			let create_log_result;
			let INDEX;
			let COUNTER=0;
			let status_V="V";
			let account_active_mail_json;
			let account_active_mail_json_service;
			if(Cust_Account.length<1)
			{
				throw(new Error("ERROR_EMAIL_UNMATCH"));
			}
			else
			{
				for(INDEX=0;INDEX<Cust_Account.length;INDEX++)
				{
					if(Cust_Account[INDEX].verify_code==inputCode)
					{
						Cust_Account_Verify=Cust_Account[INDEX];
						COUNTER=COUNTER+1;
					}
				}
				if(typeof(Cust_Account_Verify)!=undefined && COUNTER==1)
				{
					let code_expired_date;
					if(Cust_Account_Verify.count>2)
					{
						Cust_Account_Verify.verify_code="";
						Cust_Account_Verify.url="";
						let update_Cust_Account = 
						{
							"url":"",
							"reset_url":"",
							"verify_code":"",
							"edit_date":strtoday,
						};
						conditions_update.account=Cust_Account_Verify.account;
						conditions_update.sino_account=Cust_Account_Verify.sino_account;
						set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
						account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account_Verify);
						create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
						throw(new Error("ERROR_VERIFY_CODE_INVALID"));
					}
					else
					{
						try
						{
							code_expired_date=new Date(Cust_Account_Verify.expire_date);
							debug("Is today > code_expired_date?"+datenow+" "+code_expired_date);
							if(datenow>code_expired_date)
							{
								throw(new Error("ERROR_VERIFY_CODE_EXPIRED"));
							}
							else
							{
								conditions_update = { "account":Cust_Account_Verify.account ,"sino_account":Cust_Account_Verify.sino_account};
								//UPDATE the uniq user
								let update_Account_value = {};
								let return_data = {};
								if(req.body.data.type === "url"){
									Cust_Account_Verify.url="";
									Cust_Account_Verify.reset_url=salt;
									Cust_Account_Verify.count=0;
									Cust_Account_Verify.mail_count=0;
									Cust_Account_Verify.status=status_V;
									update_Account_value = {
										"url":"",
										"status":status_V,
										"reset_url":salt,
										"count":0,
										"mail_count":0,
										"reset_url_expire":strnextdayTime,
										"edit_date":strtoday,
									};
									return_data = {
										"type":			"reset_url",
										"token":		salt,
									};
									account_active_mail_json=mailjson.account_active_mail(Cust_Account_Verify.email,Cust_Account_Verify.account,"");
									account_active_mail_json_service=mailjson.account_active_mail_service(mailjson.adminEmail(),Cust_Account_Verify.name,Cust_Account_Verify.account);
								}else{
									debug("reset_url : "+Cust_Account_Verify.reset_url);
									Cust_Account_Verify.count=0;
									Cust_Account_Verify.mail_count=0;
									Cust_Account_Verify.status=status_V;
									update_Account_value = 
									{
										"status":status_V,
										"count":0,
										"mail_count":0,
										"edit_date":strtoday,
									};
									return_data = {
										"type":			"reset_url",
										"token":		Cust_Account_Verify.reset_url,
									};
								}
								set_result = await EmpAccountRepository.set_Cust_Account(update_Account_value,conditions_update);
								account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account_Verify);
								create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
								if(set_result ===0 && create_log_result===0)
								{
									throw(new Error("ERROR_WRONG_VERIFY_CODE"));
								}
								else
								{
									if(req.body.data.type === "url")
									{
										await axios.post(cust_mailapi,account_active_mail_json).then(
											function (res) 
											{
												let send_mail_result=res.data.toString().trim();
												//if(send_mail_result=== "email error !")
												if(send_mail_result!== "success !")
												{
													throw(new Error("ERROR_SEND_MAIL"));
												}
											});
										await axios.post(service_mailapi,account_active_mail_json_service);
										res.send({	
											"code":	messageHandler.infoHandler("INFO_READ_VERIFY_CODE_SUCCESS"),
											"data": return_data, 
										});
									}
									else
									{
										res.send({	
											"code":	messageHandler.infoHandler("INFO_READ_VERIFY_CODE_SUCCESS"),
											"data": return_data, 
										});
									}
								}
							}
						}
						catch(err)
						{
							throw(new Error("ERROR_URL_EXPIRED_FAIL"));
						}
					}
				}
				else
				{
					for(INDEX=0;INDEX<Cust_Account.length;INDEX++)
					{
						if(Cust_Account[INDEX].count<3)
						{
							Cust_Account[INDEX].count=Cust_Account[INDEX].count+1;
							let update_Cust_Account = 
							{
								"mail_count":0,
								"edit_date":strtoday,
							};
							conditions_update.account=Cust_Account[INDEX].account;
							conditions_update.sino_account=Cust_Account[INDEX].sino_account;
							update_Cust_Account.count=Cust_Account[INDEX].count;
							await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
							account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account[INDEX]);
							await EmpAccountRepository.createCust_Account_Log(account_log);
							throw(new Error("ERROR_WRONG_VERIFY_CODE"));
						}
						else
						{
							Cust_Account[INDEX].verify_code="";
							Cust_Account[INDEX].url="";
							let update_Cust_Account = 
							{
								"url":"",
								"reset_url":"",
								"verify_code":"",
								"edit_date":strtoday,
							};
							conditions_update.account=Cust_Account[INDEX].account;
							conditions_update.sino_account=Cust_Account[INDEX].sino_account;
							await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
							account_log=utility.createAccountLog("I",req.body.requester,strtoday,Cust_Account[INDEX]);
							await EmpAccountRepository.createCust_Account_Log(account_log);
							throw(new Error("ERROR_VERIFY_CODE_INVALID"));
						}
					}
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}catch(err){
		next(err);
	}
};

/**
 * 點擊修改密碼。客戶已經登入的狀態下做密碼重設
 * @param  {} req { "data":{"account":"xxxxxxxxxx","sinoaccount" : "xxxxxxx","oldpassword":"xxxxxx","newpassword":"xxxxxx"},"requester":"用戶帳號"}
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "Success/Fail" }
 * @param  {} next 無
 */
module.exports.resetpassword = async (req, res, next) => 
{
	const messageHandler = require("../helper/MessageHandler");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const debug = require("debug")("KumonCheckINApi:CustAccountService.resetpassword");
	const config = require("../Config");
	let dateFormat = require("date-format");
	const utility=require("../helper/Utility");
	const mailjson=require("../helper/KumonCheckInMail");
	const axios = require("axios");
	const crypto = require("crypto");
	try{
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("sinoaccount")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("oldpassword") || req.body.data.oldpassword === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("newpassword") || req.body.data.newpassword === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(req.body.data.account !== req.body.requester) throw (new Error("ERROR_UNAUTHORIZED"));
			//prepare data
			debug("account="+req.body.data.account+" "+req.body.data.sinoaccount+"old pass="+req.body.data.oldpassword+"new pass="+req.body.data.newpassword);
			//prepare data
			const mailapi = config[process.env.NODE_ENV].Cust_MailServer.policy + "://" + 
							config[process.env.NODE_ENV].Cust_MailServer.host + ":" + config[process.env.NODE_ENV].Cust_MailServer.port+"/"+config[process.env.NODE_ENV].Cust_MailServer.api;
			let strtodatetime=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
			let inputAccount=req.body.data.account;
			let inputSinoAccount=req.body.data.sinoaccount;
			let oldPass=req.body.data.oldpassword;
			let newPass=req.body.data.newpassword;
			let RandomPWSalt = crypto.randomBytes(16).toString("base64").substr(0, 16);
			let passwordsalt=RandomPWSalt;
			let new_salt=utility.randomNumber(9999999999999999);
			let condition_by_account = [{"key":"Cust_Account.account","value":inputAccount},{"key":"Cust_Account.sino_account","value":inputSinoAccount}];
			let Cust_Account_without_password=await EmpAccountRepository.getCust_Account_and_Custs(condition_by_account);
			//get password salt
			if(Cust_Account_without_password.length<1)
			{
				throw(new Error("ERROR_ACCOUNT_NOT_EXISTED"));
			}
			else
			{
				passwordsalt=Cust_Account_without_password[0].passwordsalt;
				oldPass=utility.encryption(oldPass+passwordsalt);
				debug("old pass="+oldPass);
			}
			let condition = [{"key":"Cust_Account.account","value":inputAccount},{"key":"Cust_Account.sino_account","value":inputSinoAccount},{"key":"Cust_Account.password","value":oldPass}];
			let conditions_update = { "account":"" ,"sino_account":""};
			//select by account
			let Cust_Account=await EmpAccountRepository.getCust_Account_and_Custs(condition);
			let account_log;
			let set_result;
			let create_log_result;
			if(Cust_Account.length<1)
			{
				throw(new Error("ERROR_ACCOUNT_NOT_EXISTED"));
			}
			else
			{
				if(typeof(newPass)!=undefined && newPass.length>5)
				{
					Cust_Account[0].password=utility.encryption(newPass+new_salt);
					debug("new pass="+Cust_Account[0].password);
					Cust_Account[0].count=0;
					let update_Cust_Account = 
					{
						"password":utility.encryption(newPass+new_salt),
						"passwordsalt":new_salt,
						"count":0,
						"edit_date":strtodatetime,
					};
					conditions_update.account=inputAccount;
					conditions_update.sino_account=inputSinoAccount;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					account_log=utility.createAccountLog("I",req.body.requester,strtodatetime,Cust_Account[0]);
					create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
					if(set_result ===0 && create_log_result===0){
						throw(new Error("ERROR_INTERNAL_SERVER_ERROR"));
					}else{
						let password_reset_mail_json=mailjson.password_reset_mail(Cust_Account[0].email,Cust_Account[0].account,"");
						let password_reset_mail_json_service=mailjson.password_reset_mail_service(mailjson.adminEmail(),Cust_Account[0].name,Cust_Account[0].account);
						let active_mail_result = await axios.post(mailapi,password_reset_mail_json).then(
							function (res) 
							{
								let send_mail_result=res.data.toString().trim();
								//if(send_mail_result=== "email error !")
								if(send_mail_result!== "success !")
								{
									throw(new Error("ERROR_SEND_MAIL"));
								}
							});
						let active_mail_result_service = await axios.post(mailapi,password_reset_mail_json_service);
						if(active_mail_result ==="success !" && active_mail_result_service==="success !"){
							throw(new Error("ERROR_ACCOUNT_EMAIL_INVALID"));
						}else{
							res.send({	
								"code":	messageHandler.infoHandler("INFO_RESET_PASSWORD_SUCCESS"),
								"data": [], 
							});
						}
					}
				}
				else
				{
					throw(new Error("ERROR_PASSWORD_TOO_SHORT"));
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}catch(err){
		next(err);
	}
};
		
/**
 * 確認客戶填寫的資料，並重設密碼。
 * 忘記密碼，透過url進到忘記密碼頁面做密碼更新。 (帶要設定的Password，Token跟VerifyCode以及客戶IP)
 * @param  {} req 輸入data{"password":"xxxxxx","verifycode":"xxxx","token"="xxxx-xxxx-xxxx-xxxx"}，"requester":"客戶IP"} 
 * @param  {} res { "code" : { "type": "xxx", "message":  "xxxxx", }, "data" :  "Success/Fail" }
 * @param  {} next 無
 */
module.exports.verifypassword = async (req, res, next) => 
{
	const messageHandler = require("../helper/MessageHandler");
	const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const CustPwdResetRepository=require("../repositories/CustPwdResetRepository");
	const debug = require("debug")("KumonCheckINApi:CustAccountService.verifypassword");
	let dateFormat = require("date-format");
	const utility=require("../helper/Utility");
	const config=require("../config");
	const mailjson=require("../helper/KumonCheckInMail");
	const axios = require("axios");
	try
	{
		//prepare data
		const cust_mailapi = config[process.env.NODE_ENV].Cust_MailServer.policy + "://" + 
						config[process.env.NODE_ENV].Cust_MailServer.host + ":" + config[process.env.NODE_ENV].Cust_MailServer.port+"/"+config[process.env.NODE_ENV].Cust_MailServer.api;
		const service_mailapi = config[process.env.NODE_ENV].local_MailServer.policy + "://" + 
						config[process.env.NODE_ENV].local_MailServer.host + ":" + config[process.env.NODE_ENV].local_MailServer.port+"/"+config[process.env.NODE_ENV].local_MailServer.api;
		let datenow=new Date();
		let strtodaytime=dateFormat.asString("yyyy/MM/dd hh:mm:ss", new Date());
		let strtoday=dateFormat.asString("yyyy/MM/dd", new Date());
		// let strNextday=utility.setDate(new Date(),"yyyy/MM/dd",0,1,0,0);
		let strNextday=dateFormat.asString("yyyy/MM/dd", new Date((new Date().setDate(datenow.getDate()+1))));
		let inputPassword;
		let inputVerify;
		let inputUserIP;
		let status_V="V";
		let status_A="A";
		let status_U="U";
		let passwordsalt=utility.randomNumber(9999999999999999);
		// check parameters
		if(!req.body.hasOwnProperty("data")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.hasOwnProperty("requester")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("password") || req.body.data.password === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("verifycode") || req.body.data.verifycode === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		if(!req.body.data.hasOwnProperty("token") || req.body.data.token === "") throw(new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			inputPassword=req.body.data.password;
			inputVerify=req.body.data.verifycode;
			inputUserIP=req.body.requester;
			let condition = [{"key":"reset_url","value":req.body.data.token}];
			let condition_verify = [{"key":"reset_url","value":req.body.data.token},{"key":"verify_code","value":inputVerify}];
			let conditions_update = { "account":"" ,"sino_account":"","reset_url":req.body.data.token};
			let getCustPwd_conditions_ip=[{"key":"cust_ip","operator":"=","value":req.body.requester},{"key":"create_date","operator":">=","value":strtoday},{"key":"create_date","operator":"<","value":strNextday}];
			let INDEX=0;
			let create_reser_pwd_result;
			let account_changepassword_mail_json;
			let account_changepassword_mail_json_service;
			//percheck
			let query_byIp=await CustPwdResetRepository.getCustPwdReset(getCustPwd_conditions_ip);
			let new_Reset_Pwd_Log = 
				{
					"account":"verifypassword",
					"mail":"verifypassword",
					"match":0,
					"frequently":1,
					"reset_url":req.body.data.token,
					"cust_ip":inputUserIP,
					"create_date":strtodaytime
				};
			if(query_byIp.length>=10)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				let malicious_mail_service_json=mailjson.malicious_mail_service(mailjson.adminEmail(),req.body.requester,req.body.data.token);
				await axios.post(service_mailapi,malicious_mail_service_json);
				throw(new Error("ERROR_TOO_FREQUENTLY"));
			}
			if(typeof(req.body.data.verifycode)==undefined || typeof(req.body.data.password)==undefined || typeof(req.body.data.token)==undefined)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				throw(new Error("ERROR_INPUT_DATA"));
			}
			else if(inputPassword.length<5)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				throw(new Error("ERROR_PASSWORD_TOO_SHORT"));
			}
			//select by url
			let Cust_Account=await EmpAccountRepository.getCust_Account_and_Custs(condition);
			let Cust_Account_verify=await EmpAccountRepository.getCust_Account_and_Custs(condition_verify);
			if(Cust_Account.length<1)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				throw(new Error("ERROR_ACCOUNT_NOT_EXISTED"));
			}
			if(Cust_Account_verify.length<1)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				throw(new Error("ERROR_ACCOUNT_NOT_EXISTED"));
			}
			let account_log;
			let set_result;
			let create_log_result;
			let new_Reset_Pwd_Log_with_account = 
			{
				"account":Cust_Account[0].account,
				"mail":Cust_Account[0].email,
				"match":0,
				"frequently":0,
				"reset_url":req.body.data.token,
				"cust_ip":inputUserIP,
				"create_date":strtodaytime
			};
			let new_Reset_Pwd_Log_with_verify = 
			{
				"account":Cust_Account_verify[0].account,
				"mail":Cust_Account_verify[0].email,
				"match":0,
				"frequently":0,
				"reset_url":req.body.data.token,
				"cust_ip":inputUserIP,
				"create_date":strtodaytime
			};
			if(Cust_Account.length<1)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log);
				throw(new Error("ERROR_URL_NOT_FOUND"));
			}
			else if(Cust_Account_verify.length!=Cust_Account.length)
			{
				create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log_with_account);
				for(INDEX=0;INDEX<Cust_Account.length;INDEX++)
				{
					Cust_Account[INDEX].mail_count=Cust_Account[INDEX].mail_count+1;
					Cust_Account[INDEX].edit_date=strtoday;
					let update_Cust_Account = 
					{
						"mail_count":Cust_Account[INDEX].mail_count,
						"edit_date":strtodaytime,
					};
					conditions_update.account=Cust_Account[INDEX].account;
					conditions_update.sino_account=Cust_Account[INDEX].sino_account;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					account_log=utility.createAccountLog("I",req.body.requester,strtodaytime,Cust_Account[INDEX]);
					create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
					throw(new Error("ERROR_WRONG_VERIFY_CODE"));
				}
			}
			else
			{
				if(Cust_Account_verify[0].status!=status_V && Cust_Account_verify[0].status!=status_U) 
				{
					create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log_with_verify);
					Cust_Account[0].mail_count=Cust_Account[0].mail_count+1;
					Cust_Account[0].edit_date=strtodaytime;
					let update_Cust_Account = 
					{
						"mail_count":Cust_Account[0].mail_count,
						"edit_date":strtodaytime,
					};
					conditions_update.account=Cust_Account[0].account;
					conditions_update.sino_account=Cust_Account[0].sino_account;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					account_log=utility.createAccountLog("I",req.body.requester,strtodaytime,Cust_Account[0]);
					create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
					throw(new Error("ERROR_ACCOUNT_STATUS_V"));
				}
				else if(Cust_Account_verify[0].mail_count>2)
				{
					create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log_with_verify);
					Cust_Account_verify[0].verify_code="";
					Cust_Account_verify[0].reset_url="";
					Cust_Account_verify[0].edit_date=strtodaytime;
					let update_Cust_Account = 
					{
						"reset_url":"",
						"url":"",
						"verify_code":"",
						"edit_date":strtodaytime,
						"mail_count":0,
					};
					conditions_update.account=Cust_Account_verify[0].account;
					conditions_update.sino_account=Cust_Account_verify[0].sino_account;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					account_log=utility.createAccountLog("I",req.body.requester,strtodaytime,Cust_Account_verify[0]);
					create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
					throw(new Error("ERROR_VERIFY_CODE_INVALID"));
				}
				else if(Cust_Account_verify[0].reset_url_expire<strtodaytime)
				{
					create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log_with_verify);
					throw(new Error("ERROR_VERIFY_CODE_EXPIRED"));
				}
				else
				{
					inputPassword=utility.encryption(inputPassword+passwordsalt);
					create_reser_pwd_result = await CustPwdResetRepository.createCustPwdReset(new_Reset_Pwd_Log_with_verify);
					debug(inputPassword);
					Cust_Account_verify[0].mail_count=0;
					Cust_Account_verify[0].status=status_A;
					Cust_Account_verify[0].edit_date=strtodaytime;
					Cust_Account_verify[0].password=inputPassword;
					Cust_Account_verify[0].passwordsalt=passwordsalt;
					Cust_Account_verify[0].reset_url="";
					Cust_Account_verify[0].verify_code="";
					Cust_Account_verify[0].count=0;
					let update_Cust_Account = 
					{
						"count":0,
						"url":"",
						"reset_url":"",
						"verify_code":"",
						"password":inputPassword,
						"passwordsalt":passwordsalt,
						"status":status_A,
						"mail_count":0,
						"edit_date":strtodaytime,
					};
					conditions_update.account=Cust_Account_verify[0].account;
					conditions_update.sino_account=Cust_Account_verify[0].sino_account;
					set_result = await EmpAccountRepository.set_Cust_Account(update_Cust_Account,conditions_update);
					account_log=utility.createAccountLog("I",req.body.requester,strtodaytime,Cust_Account_verify[0]);
					create_log_result= await EmpAccountRepository.createCust_Account_Log(account_log);
					
					account_changepassword_mail_json=mailjson.password_reset_mail(Cust_Account_verify[0].email,Cust_Account_verify[0].account,"");
					account_changepassword_mail_json_service=mailjson.password_reset_mail_service(mailjson.adminEmail(),Cust_Account_verify[0].name,Cust_Account_verify[0].account);
					await axios.post(cust_mailapi,account_changepassword_mail_json).then(
						function (res) 
						{
							let send_mail_result=res.data.toString().trim();
							//if(send_mail_result=== "email error !")
							if(send_mail_result!== "success !")
							{
								throw(new Error("ERROR_SEND_MAIL"));
							}
						});
					await axios.post(service_mailapi,account_changepassword_mail_json_service);
					if(set_result ===0 && create_log_result===0 && create_reser_pwd_result===0)
					{
						throw(new Error("ERROR_INTERNAL_SERVER_ERROR"));
					}else{
						res.send({	
							"code":	messageHandler.infoHandler("INFO_RESET_PASSWORD_SUCCESS"),
							"data": [], 
						});
					}
				}
			}
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}catch(err){
		next(err);
	}
};
