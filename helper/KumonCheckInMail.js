/**
 * @module helper/KumonCheckINMail
 */

/**
 * Default mail list
 */
module.exports.adminEmail = () => 
{
	let maillist="hollyamuro@gmail.com;elane1108@gmail.com";
	let maillist_prod="hollyamuro@gmail.com;elane1108@gmail.com";
	if(process.env.NODE_ENV !== "production")
		return maillist;
	else
		return maillist_prod;
};

/**
 * Disclaimer English
 */
module.exports.disclaimerEn=()=>
{
	let disclaimer="Disclaimer: This mail and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed. Any disclosure, copying or distribution of this mail without the sender’s consent is strictly prohibited. If you are not the intended addressee, or the person responsible for delivering it to them, you may not copy, forward, disclose or otherwise use it or any part of it in any way that may be considered unlawful. If you receive this mail by mistake, please advise the sender and delete it immediately. Internet communications cannot be guaranteed to be virus-free. The recipient is responsible for ensuring that this email is virus free and the sender accepts no liability for any damages caused by virus transmitted by email.";
	return disclaimer;
};

/**
 * Disclaimer Chiness
 */
module.exports.disclaimerCH=()=>
{
	let disclaimer="本郵件之資訊可能含有機密或特殊管制之資 料，僅供指定之收件人使用，未經寄件人許可 不得揭露、複製或散布本郵件。若台端非本郵 件所指定之收件人，任何複製、轉寄、開啟或 以任何形式使用本郵件資訊皆不合法。如為誤 傳也請立即刪除本郵件並通知寄件者。網路通 訊無法保證本郵件之安全性，若因此造成任何 損害，本公司恕不負責。";
	return disclaimer;
};


/**
 * Check in mail
 * @param  {} mail box about receivers
 * @param  {} user account
 * @param  {} invite url link
 */
module.exports.CheckInmail = (receivers,account,url) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"to":receivers,
		"subject":"Kumon Checkin Notification",
		"html":"<html><body>您好：<br>帳號："+account+"<br><br>    已經於功文教室打卡成功。<br><br>    如有任何問題，請與業務人員聯繫。<br>        感謝您 <br><br>"+disclaimerch+"<br><br>                                                Kumon文教機構淡水分支機構<br><br><br>"+
        "Dear Customer,<br>Account No. :"+account+"<br><br>Has Check_In Success.<br>Thank you.<br><br>"+disclaimeren+"<br><br>                                                 Kumon Corporation Tanshui Class office<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};
/**
 * resetpassmail
* @param  {} mail box about receivers
 * @param  {} user account
 * @param  {} reset password url link
 */
module.exports.resetpassmail = (receivers,account,url) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Verification",
		"content":"<html><body>親愛的客戶，您好：<br>您的託管帳號："+account+"<br><br>    感謝您申請永豐金證券國際證券業務分公司託管帳戶密碼重設服務。<br>請自系統寄發認證連結網址之通知時間起，於一個工作日內至以下網址完成重設密碼流程：<br><br>"+url+"<br><br>"+"	如有任何問題，請與業務人員聯繫。<br>        感謝您。<br><br>"+disclaimerch+"<br><br>							永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
        "Dear Customer,<br>Your Custody Account No. :"+account+"<br><br>You just requested a password reset service.<br>Please click the following link to verify your account within 1 business day of receiving the verification code.<br><br>"+url+"<br><br>If you have any question, please contact with your sales.<br><br>Thank you.<br><br>"+disclaimeren+"<br><br> 							SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};
/**
 * resetpassmail_service
 * @param  {} mail box about receivers
 * @param  {} user account
 * @param  {} reset password url link
 */
module.exports.resetpassmail_service = (receivers,account,url) => 
{
	const config = require("../Config");
	let mail_json={
		"from":config[process.env.NODE_ENV].local_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Verification",
		"content":"<html><body>客戶申請重設密碼通知：<br><br>       客戶:"+account+"取得下列url進行重設密碼流程：<br>"+url+" <br>"+"<br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * verifycodemail
 * @param  {} mail box about receivers
 * @param  {} user account
 * @param  {} Verify code
 */
module.exports.verifycodemail = (receivers,account,verifycode) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Verification",
		"content":"<body><html>親愛的客戶，您好：<br>您的託管帳號："+account+" ，註冊驗證碼為："+verifycode+"<br><br>請於五分鐘內完成驗證註冊，<br>如有任何問題，請與業務人員聯繫。<br><br>          感謝您<br><br>"+disclaimerch+"<br><br>							永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
        "Dear Customer,<br>Your Custody Account No. :"+account+" ,Verification Code:"+verifycode+"<br><br>Please complete the verification in 5 minutes.<br>If you have any question, please contact with your sales.<br>Thank you.<br><br>"+disclaimeren+"<br><br>							SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * resetverifycodemail
 * @param  {} mail box about receivers
 * @param  {} user account
 * @param  {} reset mail verify code
 */
module.exports.resetverifycodemail = (receivers,account,verifycode) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Verification",
		"content":"<body><html>親愛的客戶，您好：<br>您的託管帳號："+account+"，重設密碼驗證碼為："+verifycode+"<br><br>請於五分鐘內完成重設驗證，<br>如有任何問題，請與業務人員聯繫。<br><br>          感謝您<br><br>"+disclaimerch+"<br><br>							永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
        "Dear Customer,<br>Your Custody Account No. :"+account+"，Verification Code："+verifycode+"<br><br>Please complete the verification in 5 minutes.<br>If you have any question, please contact with your sales.<br>Thank you.<br><br>"+disclaimeren+"<br><br>							SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * lock_password_fail_mail
 * @param  {} mail box about receivers
 * @param  {} user account
 * @param  {} password lock url
 */
module.exports.lock_password_fail_mail = (receivers,account,url) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification",
		"content":"<html><body>親愛的客戶，您好：<br><br>         您於永豐金證券國際證券業務分公司託管帳戶網路查詢服務的帳戶("+account+")因登入密碼錯誤多次而被鎖定。<br><br>如有任何問題，請與業務人員聯繫。<br>    感謝您<br><br>"+disclaimerch+"<br><br>                                                 永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
        "Dear Customer,<br><br>Your SinoPac Securities OSU Online Custody Service Account ("+account+") had been locked after too many failed password attempts.<br><br>If you have any question, please contact with your sales.<br><br>Thank you.<br><br>"+disclaimeren+"<br><br>                                                 SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * lock_password_fail_mail_service
 * @param  {} mail box about receivers
 * @param  {} user name
 * @param  {} user account
 */
module.exports.lock_password_fail_mail_service = (receivers,name,account) => 
{
	const config = require("../Config");
	let mail_json={
		"from":config[process.env.NODE_ENV].local_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification",
		"content":"<html><body>帳戶鎖定通知：<br><br>客戶帳號:"+name+"<br>帳戶:"+account+"<br>因為密碼錯誤過多次被鎖定。<br><br>永豐金證券股份有限公司　國際證券業務分公司<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * cancel_account_mail
 * @param  {} mail box about receivers
 * @param  {} user account
 */
module.exports.cancel_account_mail = (receivers,account,url) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification",
		"content":"<html><body>親愛的客戶，您好：<br><br>                  您於永豐金證券國際證券業務分公司託管帳戶網路查詢服務的帳戶("+account+")因銷戶而被鎖定。<br><br>如有任何問題，請與業務人員聯繫。<br>    感謝您<br><br>"+disclaimerch+"<br><br>                                                 永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
        "Dear Customer,<br><br>Your SinoPac Securities OSU Online Custody Service Account ("+account+") had been closed.<br><br>If you have any question, please contact with your sales.<br><br>Thank you.<br><br>"+disclaimeren+"<br><br>                                                SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * cancel_account_mail_sevice
 * @param  {} mail box about receivers
 * @param  {} user name
 * @param  {} user account
 */
module.exports.cancel_account_mail_sevice = (receivers,name,account) => 
{
	const config = require("../Config");
	let mail_json={
		"from":config[process.env.NODE_ENV].local_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Account Locked Notification.",
		"content":"<html><body>帳戶鎖定通知：<br><br>客戶:"+name+"<br>帳戶:"+account+"<br>已經銷戶封鎖。<br><br>永豐金證券股份有限公司　國際證券業務分公司<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * account_active_mail
 * @param  {} mail box about receivers
 * @param  {} user account 
 */
module.exports.account_active_mail = (receivers,account,url) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification.",
		"content":"<html><body>親愛的客戶，您好：<br>您的託管帳號："+account+"<br>    您於永豐金證券國際證券業務分公司託管帳戶網路查詢服務的帳戶已經啟用。<br><br>        感謝您<br><br>"+disclaimerch+"<br><br>                                                 永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
        "Dear Customer,<br>Your Custody Account No. :"+account+"<br><br>Your SinoPac Securities Corporation OSU Custody Online Service Account had been activated.<br><br>Thank you.<br><br>"+disclaimeren+"<br><br>                                                 SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};


/**
 * account_active_mail_service
 * @param  {} mail box about receivers
 * @param  {} user name
 * @param  {} user account
 */
module.exports.account_active_mail_service = (receivers,name,account) => 
{
	const config = require("../Config");
	let mail_json={
		"from":config[process.env.NODE_ENV].local_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification.",
		"content":"<html><body>開戶通知：<br><br>客戶:"+name+"<br>帳戶:"+account+"<br>已經啟用。<br><br>永豐金證券股份有限公司　國際證券業務分公司<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * password_reset_mail
 * @param  {} mail box about receivers
 * @param  {} user account
 */
module.exports.password_reset_mail = (receivers,account,url) => 
{
	const mailmodule= require("./KumonCheckInMail");
	const config = require("../Config");
	let disclaimerch=mailmodule.disclaimerCH();
	let disclaimeren=mailmodule.disclaimerEn();
	let mail_json={
		"from":config[process.env.NODE_ENV].Cust_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification.",
		"content":"<html><body>親愛的客戶，您好：<br>您的託管帳號："+account+"<br><br>    您於永豐金證券國際證券業務分公司託管帳戶網路查詢服務的密碼驗證已經完成。<br><br>        感謝您 <br><br>"+disclaimerch+"<br><br>                                                 永豐金證券股份有限公司　國際證券業務分公司<br><br><br>"+
            "Dear Customer,<br>Your Custody Account No. :"+account+"<br><br>Your SinoPac Securities OSU Online Custody Online Service password is verified successfully.<br><br>Thank you.<br><br>"+disclaimeren+"<br><br>                                                 SinoPac Securities Corporation Offshore Securities Unit<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * password_reset_mail_service
 * @param  {} mail box about receivers
 * @param  {} user name
 * @param  {} user account
 */
module.exports.password_reset_mail_service = (receivers,name,account) => 
{
	const config = require("../Config");
	let mail_json={
		"from":config[process.env.NODE_ENV].local_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification",
		"content":"<html><body>客戶密碼更換通知：<br><br>客戶:"+name+"<br>帳戶:"+account+"<br>已經通過密碼重設驗證做密碼重置。<br><br>永豐金證券股份有限公司　國際證券業務分公司<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};

/**
 * malicious_mail_service
 * @param  {} mail box about receivers
 * @param  {} user ip
 * @param  {} user account
 */
module.exports.malicious_mail_service = (receivers,ip,account) => 
{
	const config = require("../Config");
	let mail_json={
		"from":config[process.env.NODE_ENV].local_MailServer.from,
		"receivers":receivers,
		"subject":"SinoPac Securities OSU Online Custody Service Notification",
		"content":"<html><body>惡意攻擊通知：<br><br>網址:"+ip+"<br>嘗試多次使用帳戶或token:"+account+"<br><br>。永豐金證券股份有限公司　國際證券業務分公司<br><br><br><img src=\"logo.png\"/></body></html>"
		,"attachments": [
			{
				"filename": "logo.png",
				"path": "./KumonCheckINData/logo.png"
			}
		]
	};
	return mail_json;
};