/**
 * 系統訊息處理
 * @module helper/MessageHandler
 */

"use strict";

/**
 * 反饋錯誤處理
 * @param  {Object} error
 */
module.exports.errorHandler = (error) => {

	const messageCodes = require("./MessageCodes");
	const debug = require("debug")("KumonCheckINApi:MessageHandler.errorHandler");
	
	try
	{
		switch(error.name){ 
		default:{
			/* customize code (name use default error)*/
			if(messageCodes.ERROR[error.message]){
				return {
					"type": 	messageCodes.ERROR[error.message].type,
					"title": 	messageCodes.ERROR[error.message].title,
					"message": 	messageCodes.ERROR[error.message].message,
				};
			}
				
			/* default code */
			return {
				"type": 	messageCodes.ERROR.ERROR_INTERNAL_SERVER_ERROR.type,
				"title": 	messageCodes.ERROR.ERROR_INTERNAL_SERVER_ERROR.title,
				"message": 	messageCodes.ERROR.ERROR_INTERNAL_SERVER_ERROR.message,
			};
		}
		}
	}
	catch(err){
		debug(err.stack);
		throw(err);
	}
};

/**
 * 反饋訊息處理：type、title、message
 * @param  {String} msgCode
 */
module.exports.infoHandler = (msgCode) => {
	
	const messageCodes = require("./MessageCodes");
	const debug = require("debug")("KumonCheckINApi:MessageHandler.infoHandler");

	try
	{
		debug("取得訊息碼"+msgCode);
		if(messageCodes.INFO[msgCode]){
			return {
				"type": 	messageCodes.INFO[msgCode].type,
				"title": 	messageCodes.INFO[msgCode].title,
				"message": 	messageCodes.INFO[msgCode].message,
			};
		}

		if(messageCodes.ERROR[msgCode]){
			return {
				"type": 	messageCodes.INFO[msgCode].type,
				"title": 	messageCodes.INFO[msgCode].title,
				"message": 	messageCodes.INFO[msgCode].message,
			};
		}

		if(messageCodes.WARN[msgCode]){
			return {
				"type": 	messageCodes.WARN[msgCode].type,
				"title": 	messageCodes.INFO[msgCode].title,
				"message": 	messageCodes.WARN[msgCode].message,
			};
		}

		//default
		return {
			"type": 	messageCodes.INFO.INFO_OK.type,
			"title": 	messageCodes.INFO.INFO_OK.type,
			"message": 	messageCodes.INFO.INFO_OK.message,
		};

	}
	catch(err){
		debug(err.stack);
		throw(err);
	}
};