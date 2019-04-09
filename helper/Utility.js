/**
 * 共用程式
 * @module helper/Utility
 */

"use strict";


/**
 * 指定日期格式，將Js Date轉成DB用的String
 *EX： 
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss",0,0,0,0,0) ==> 2018-07-02 08:09:04
 *(new Date()).Format("yyyy-M-d",0,0,1,0,0)      ==> 2018-7-3
 *(new Date()).Format("yyyy-MM-dd hh:mm:ss",1,2,3,4,5)      ==> 2019-09-05 12:09:04
 * @param  {} format 日期格式，子串。
 * @param  {} addmonth 數值 增加幾月
 * @param  {} addday 數值 增加幾日
 * @param  {} addhour 數值 增加幾小時
 * @param  {} addminute 數值 增加幾分鐘
 */
module.exports.setDate=function(Date,format,addmonth,addday,addhour,addminute)
{
	let o = {
		"M+": Date.getMonth()+1+addmonth, //月份0開始
		"d+": Date.getDate()+addday, //日 
		"h+": Date.getHours()+addhour, //時
		"m+": Date.getMinutes()+addminute, //分 
		"s+": Date.getSeconds(), //秒 
		"q+": Math.floor((Date.getMonth() + 3) / 3), //季度 
		"S": Date.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (Date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o)
		if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return format;
};

/**
 * 產生隨機數字
 * @param  {} max 最大隨機值 int
 */
module.exports.randomNumber=function(max)
{
	return Math.floor(Math.random() * Math.floor(max));
};



/**
 * 產生Account log物件
 * @param  {type} type I = Insert / D = delete / U = update1
 * @param  {User} 建立資料者(員編、客戶、IP等等)
 * @param  {strtoday} log時間字串
 * @param  {Cust_Account} 客戶帳號物件(請參照資料庫規格 Cust_Account) 
 */
module.exports.createAccountLog=function(type,user,strtoday,Cust_Account)
{
	// const EmpAccountRepository = require("../repositories/EmpAccountRepository");
	const utility = require("./Utility");
	const debug = require("debug")("KumonCheckINApi:Utility.createAccountLog");
	// let create_log_result;
	let Cust_Account_Log = {    
		"action_type":type,
	    "action_date":strtoday,
		"action_user":user,
		"account":Cust_Account.account,
		"sino_account":Cust_Account.sino_account,
		"password":Cust_Account.password,
		"passwordsalt":Cust_Account.passwordsalt,
		"accountsalt":Cust_Account.accountsalt,
		"accounthash":Cust_Account.accounthash,
		"name":Cust_Account.name,
		"phone":Cust_Account.phone,
		"status":Cust_Account.status,
		"url":Cust_Account.url,
		"reset_url":Cust_Account.reset_url,
		"count":Cust_Account.count,
		"mail_count":Cust_Account.mail_count,
		"verify_code":Cust_Account.verify_code,
		"url_expire":utility.getSqlDateByString(Cust_Account.url_expire),
		"reset_url_expire":Cust_Account.reset_url_expire,
		"expire_date":Cust_Account.expire_date,
		"create_date":Cust_Account.create_date,
		"edit_date":strtoday,
	};
	debug(Cust_Account_Log);
	return Cust_Account_Log;
};


/**
 * 將資料庫讀取出來的js日期字串，轉換成可直接存入SQL資料庫的日期字串。
 * @param  {} Java Script的日期字串
 * return 標準的SQL日期字串(yyyy/MM/dd hh:mm:ss)
 */
module.exports.getSqlDateByString=function(inputDate)
{
	let dateFormat = require("date-format");
	try{
		if(typeof(inputDate)!=undefined)
		{
			let datetime=new Date(inputDate);
			let strdatetime =dateFormat.asString("yyyy/MM/dd hh:mm:ss", datetime);
			return strdatetime;
		}
		else
		{
			return "1900/01/01 01:01:01";
		}
	}
	catch(err)
	{
		return "1900/01/01 01:01:01";
	}
};


/**
 * Encryption Standard
 * @param {inputString} 輸入字串
 * @param {encryption} 加密後的字串
 */
module.exports.encryption=function(inputString)
{
	let aesjs = require("aes-js");
	let key_256 = [2, 0, 1, 9, 0, 0, 0, 7, 0, 0, 1, 7, 0, 0, 17, 0,
		0, 48, 0, 0, 2, 0, 1, 8, 0, 0, 0, 8, 0,
		0, 1, 5];

	let textBytes = aesjs.utils.utf8.toBytes(inputString);

	// Counter 5 times
	let aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	let encryptedBytes = aesCtr.encrypt(textBytes);
	let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
	return encryptedHex;

};

/**
 * Encryption Standard
 * @param {inputString} 輸入字串
 * @param {encryption} 解密後的字串
 */
module.exports.decryption=function(inputString)
{
	let aesjs = require("aes-js");
	let key_256 = [2, 0, 1, 9, 0, 0, 0, 7, 0, 0, 1, 7, 0, 0, 17, 0,
		0, 48, 0, 0, 2, 0, 1, 8, 0, 0, 0, 8, 0,
		0, 1, 5];
	let encryptedBytes = aesjs.utils.hex.toBytes(inputString);

	// Counter 5 times
	let aesCtr = new aesjs.ModeOfOperation.ctr(key_256, new aesjs.Counter(5));
	let decryptedBytes = aesCtr.decrypt(encryptedBytes);
	// change to string
	let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
	return decryptedText;
};

/**
 * 檢查輸入資料
 * @param  {Object} inputdata
 */
module.exports.checkInputData = async(inputdata) => 
{
	try
	{
		const debug = require("debug")("KumonCheckINApi:Utility.checkInputData");
		const InputDataRegexp = /['"/*\\]/;
		return new Promise( (resolve, reject ) => {
			Object.keys(inputdata).forEach(element => {
				debug(inputdata[element]);
				if(typeof(inputdata[element])==="number"){
                    inputdata[element] = inputdata[element].toString();
				}

				if(typeof(inputdata[element])==="object"){
                    for(let i=0; i<inputdata[element].length;i++){
                        if(inputdata[element][i].search(InputDataRegexp) >= 0){
							resolve(false);
                        }
                    }
                }
                else{
                    if(inputdata[element].search(InputDataRegexp) >= 0){
                        resolve(false);
                    }
				}
			
			});
			resolve(true);
		});
	}
	catch(err){
		throw(err);
	}
};