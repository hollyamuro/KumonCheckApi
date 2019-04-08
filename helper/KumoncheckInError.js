/**
 * 系統錯誤處理
 * @module helper/Auth
 * @see reference: https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Status
 */

"use strict";

/* Basic error format */
class KumonCheckINWebError extends Error {
	constructor(message, type,title, status) {
		super(message);
                
		this.name = this.constructor.name;
		this.type = type;
		this.title = title;
		this.status = status;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports.NotFoundError = class extends KumonCheckINWebError {
	constructor(message) {
		super(message || "ERROR_NOT_FOUND", "ERROR","System Message", 404);
	}
};

module.exports.InternalServerError = class extends KumonCheckINWebError {
	constructor(message) {
		super(message || "ERROR_INTERNAL_SERVER_ERROR", "ERROR","System Message", 500);
	}
};
