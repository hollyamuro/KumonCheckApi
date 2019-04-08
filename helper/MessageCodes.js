/**
 * 系統訊息代碼列表
 * @module helper/MessageHandler
 */

"use strict";

module.exports = {
	"ERROR" : {
        
		/* general */
		"ERROR_BAD_REQUEST":                { "type": "ERROR", "title": "System Message","message":  "ERROR_BAD_REQUEST", },
		"ERROR_UNAUTHORIZED":               { "type": "ERROR", "title": "System Message", "message":  "ERROR_UNAUTHORIZED", },
		"ERROR_FORBIDDEN":                  { "type": "ERROR", "title": "System Message", "message":  "ERROR_FORBIDDEN", },
		"ERROR_NOT_FOUND":                  { "type": "ERROR", "title": "System Message", "message":  "ERROR_NOT_FOUND", },
		"ERROR_INTERNAL_SERVER_ERROR":      { "type": "ERROR", "title": "System Message", "message":  "ERROR_INTERNAL_SERVER_ERROR", },
		"ERROR_NOT_IMPLEMENTED":            { "type": "ERROR", "title": "System Message", "message":  "ERROR_NOT_IMPLEMENTED", },
		"ERROR_SERVICE_UNAVAILABLE":        { "type": "ERROR", "title": "System Message", "message":  "ERROR_SERVICE_UNAVAILABLE", },
		"ERROR_TIMEOUT":                    { "type": "ERROR", "title": "System Message", "message":  "ERROR_TIMEOUT", },
		"ERROR_TOKEN":                    	{ "type": "ERROR", "title": "System Message", "message":  "ERROR_TOKEN", },
		"ERROR_NOT_EXISTED_USER":			{ "type": "ERROR", "title": "System Message", "message":  "The account does not exist.", },
		"ERROR_SEND_MAIL":					{ "type": "ERROR", "title": "System Message", "message":  "Fail to Sent mail", },
    
		/* data */
		"ERROR_CREATE_DATA_FAIL":           { "type": "ERROR", "title": "System Message", "message":  "新增資料發生錯誤。", },
		"ERROR_READ_DATA_FAIL":             { "type": "ERROR", "title": "System Message", "message":  "查詢資料發生錯誤。", },
		"ERROR_UPDATE_DATA_FAIL":           { "type": "ERROR", "title": "System Message", "message":  "修改資料發生錯誤。", },
		"ERROR_DELETE_DATA_FAIL":           { "type": "ERROR", "title": "System Message", "message":  "刪除資料發生錯誤。", },
		"ERROR_ACTION_Fail":                { "type": "ERROR", "title": "System Message", "message":  "作業發生錯誤。", },
		"ERROR_IMPORT_DATA_Fail":           { "type": "ERROR", "title": "System Message", "message":  "匯入資料發生錯誤。", },
		"ERROR_NOT_EXISTED_DATA":           { "type": "ERROR", "title": "System Message", "message":  "Your email or account does not exist.", },
		"ERROR_ACCOUNT_NOT_EXISTED":   		{ "type": "ERROR", "title": "System Message", "message":  "The account does not exist.", },
		"ERROR_ACCOUNT_NOT_EXISTED_DATA":   { "type": "ERROR", "title": "System Message", "message":  "The account does not exist.", },
		"ERROR_ACCOUNT_EMAIL_INVALID":   	{ "type": "ERROR", "title": "System Message", "message":  "The account does not exist.", },
		"ERROR_DUPLICATE_DATA":             { "type": "ERROR", "title": "System Message", "message":  "重複之資料。", },
		"ERROR_LACK_OF_PARAMETER":          { "type": "ERROR", "title": "System Message", "message":  "Please make sure all required fields are complete.", },
		"ERROR_INVAID_DATA":				{ "type": "ERROR", "title": "System Message", "message":  "You entered invalid characters.",},

		/* customized data error */
		"ERROR_OVERFLOW_DATE":				{ "type": "ERROR", "title": "System Message", "message":  "Date Not Within Allowable Inquiry Period.", },

		/*Verify */
		"ERROR_TOKEN_NOT_FOUND":            { "type": "ERROR", "title": "System Message", "message":  "Invalid verification link.", },
		"ERROR_TOKEN_EXPIRED":              { "type": "ERROR", "title": "System Message", "message":  "Invalid verification link.", },
		"ERROR_TOKEN_INVALID":              { "type": "ERROR", "title": "System Message", "message":  "You have tried the verification link  3 times and not complete the register process.", },
		"ERROR_EMAIL_INVALID":              { "type": "ERROR", "title": "System Message", "message":  "The email not matched.", },
		"ERROR_EMAIL_UNMATCH":              { "type": "ERROR", "title": "System Message", "message":  "The email not matched.", },
		"ERROR_EMAIL_UNMATCH_MUCH":         { "type": "ERROR", "title": "System Message", "message":  "Invalid verification link.", },
		"ERROR_EMAIL_URL_MATCH_THREE_TIME":	{ "type": "ERROR", "title": "System Message", "message":  "You have tried the verification link  3 times and not complete the register process.", },
		"ERROR_URL_NOT_FOUND":            	{ "type": "ERROR", "title": "System Message", "message":  "Verification web page not found.", },
		"ERROR_URL_EXPIRED_FAIL":           { "type": "ERROR", "title": "System Message", "message":  "Invalid verification link. Please make request again.", },

		"ERROR_WRONG_VERIFY_CODE":        { "type": "ERROR", "title": "System Message", "message":  "Incorrect verification code.", },
		"ERROR_VERIFY_CODE_INVALID":      { "type": "ERROR", "title": "System Message", "message":  "You entered incorrect verification code 3 times. Please make request again.",},
		"ERROR_VERIFY_CODE_EXPIRED":      { "type": "ERROR", "title": "System Message", "message":  "Verification code expired.",},

		/*Reset Password */
		"ERROR_TOO_FREQUENTLY":            	{ "type": "ERROR", "title": "System Message", "message":  "Frequent operations. Please contact your sales.", },
		"ERROR_PASSWORD_INVALID":			{ "type": "ERROR", "title": "System Message", "message":  "You entered wrong password 3 times and the account locked. Please make \"Forgot Password\" request.", },	
		"ERROR_INPUT_DATA":              	{ "type": "ERROR", "title": "System Message", "message":  "Invalid data entered.", },	
		"ERROR_PASSWORD_TOO_SHORT":         { "type": "ERROR", "title": "System Message", "message":  "Invalid password format or too short.", },	
		"ERROR_ACCOUNT_STATUS":          	{ "type": "ERROR", "title": "System Message", "message":  "Invalid Account Status.", },
		"ERROR_ACCOUNT_STATUS_N":          	{ "type": "ERROR", "title": "System Message", "message":  "The account does not activated.", },	
		"ERROR_ACCOUNT_STATUS_U":          	{ "type": "ERROR", "title": "System Message", "message":  "The account does not activated.", },	
		"ERROR_ACCOUNT_STATUS_V":          	{ "type": "ERROR", "title": "System Message", "message":  "You applied \"Forgot Password\" process, cannot use password reset function.", },			
		"ERROR_ACCOUNT_STATUS_L":          	{ "type": "ERROR", "title": "System Message", "message":  "The account has been locked. Please click the \"Forgot Password\" button.", },
		"ERROR_ACCOUNT_STATUS_0":          	{ "type": "ERROR", "title": "System Message", "message":  "The account has been disabled.", },
		"ERROR_ACCOUNT_STATUS_default":     { "type": "ERROR", "title": "System Message", "message":  "Invalid Account Status.", },	
		"ERROR_WRONG_ACCOUNT_OR_PASSWORD":  { "type": "ERROR", "title": "System Message", "message":  "Invalid Account and/or Password.", },
		"ERROR_WRONG_ACCOUNT":  			{ "type": "ERROR", "title": "System Message", "message":  "Invalid Account.", },	
		"ERROR_USER_NOT_ENABLE":            { "type": "ERROR", "title": "System Message", "message":  "The account has been disabled.", },	
		"ERROR_ROBORT_CHECK":            	{ "type": "ERROR", "title": "System Message", "message":  "Robot authentication fail.", },	

	},
	"WARN": {

	},
	"INFO": {
		/* general */
		"INFO_SERVICE_ALIVE":				{ "type": "INFO", "title": "System Message", "message":  "INFO_SERVICE_ALIVE", },
		"INFO_SERVICE_DEAD":				{ "type": "INFO", "title": "System Message", "message":  "INFO_SERVICE_DEAD", },

		/* account */
		"INFO_LOGIN_SUCCESS":               { "type": "INFO", "title": "System Message", "message":  "You have successfully logged in.", },
		"INFO_LOGOUT_SUCCESS":              { "type": "INFO", "title": "System Message", "message":  "You have successfully logged out.", },
		"INFO_TOKEN_SUCCESS":              	{ "type": "INFO", "title": "System Message", "message":  "INFO_TOKEN_SUCCESS", },
        
		/* data */
		"INFO_NO_DATA":						{ "type": "INFO", "title": "System Message", "message":  "No Data Found For Inquiry", },
		"INFO_CREATE_DATA_SUCCESS":         { "type": "INFO", "title": "System Message", "message":  "新增資料成功。", },
		"INFO_READ_DATA_SUCCESS":           { "type": "INFO", "title": "System Message", "message":  "查詢資料成功。", },
		"INFO_READ_EMAIL_SUCCESS":          { "type": "INFO", "title": "System Message", "message":  "The email matched.", },
		"INFO_READ_VERIFY_CODE_SUCCESS":    { "type": "INFO", "title": "System Message", "message":  "The verification code matched.", },
		"INFO_UPDATE_DATA_SUCCESS":         { "type": "INFO", "title": "System Message", "message":  "修改資料成功。", },
		"INFO_DELETE_DATA_SUCCESS":         { "type": "INFO", "title": "System Message", "message":  "刪除資料成功。", },
		"INFO_ACTION_SUCCESS":       		{ "type": "INFO", "title": "System Message", "message":  "作業成功。", },
		"INFO_IMPORT_DATA_SUCCESS":         { "type": "INFO", "title": "System Message", "message":  "匯入資料成功。", },
		"INFO_RESET_PASSWORD_SUCCESS":      { "type": "INFO", "title": "System Message", "message":  "Your password has been reset. Please login again.", },
		"INFO_SET_PASSWORD_SUCCESS":      	{ "type": "INFO", "title": "System Message", "message":  "Your password has been reset. Please login again.", },

		/* account */
		"INFO_NOT_EXISTED_USER":           { "type": "INFO", "title": "System Message", "message":  "The account does not exist.", },
		"INFO_NO_EMAIL":                   { "type": "INFO", "title": "System Message", "message":  "The email not matched.", },
		"INFO_USER_NOT_ENABLE":            { "type": "INFO", "title": "System Message", "message":  "The account has been disabled.", },
		"INFO_USER_ALREADY_ACTIVATED":     { "type": "INFO", "title": "System Message", "message":  "The account has been activated.", },
		"INFO_WRONG_ACCOUNT_OR_PASSWORD":  { "type": "INFO", "title": "System Message", "message":  "Invalid Account and/or Password.", },			
		
	},
	/*Add other defined codes here ...*/
};