/**
 * forever套件用相關共用功能
 * @module controllers/CommonMethod
 */

"use strict";

/**
 * 停止在forever下運行的服務
 * @param {String} keyword 服務名稱
 */
module.exports.killForeverPid = function(keyword) {
	
	const debug = require("debug")("KumonCheckINApi:CommonMethod.killForeverPid");
	const forever = require("forever");

	forever.list("", function(err, results) {
		if (results === "{}" || results === "undefined" || results === null) {
			debug("No Forever processing.");
			return;
		} else {
			results.forEach(function(element) {
				if (element.file.indexOf(keyword) > -1) {
					forever.cli.stop(element.pid);
				}
			});
		}
	});
};

/**
 * 當服務重新啟動時，發信通知。
 */
module.exports.foreverCheck = function() {

	const forever = require("forever");
	const debug = require("debug")("KumonCheckINApi:CommonMethod.foreverCheck");
	const config = require("../Config");
	const monitorConfig = require("../MonitorConfig");
	const axios = require("axios");

	forever.list("", function(err, results) {
		let server_path =   config[process.env.NODE_ENV].KumonCheckInWeb.policy + "://" + 
                            config[process.env.NODE_ENV].KumonCheckInWeb.host + ":" + 
                            config[process.env.NODE_ENV].KumonCheckInWeb.port;

		let mail_api_path = "/api/mail_controller/send";
		if (results === "{}" || results === "undefined" || results === null) {
			let restart_content = "KumonCheckINApi is statred.";
			axios.post(server_path + mail_api_path, {
				receivers: monitorConfig[process.env.NODE_ENV].developers.mail,
				subject: "KumonCheckINApi is statred.",
				content: restart_content,
			}).then(function(response) {
					// debug(response);
			}).catch(function(error) {
					debug(error);
			});
			debug("No Forever processing.");
			return;
		} 
		else {
			results.forEach(element => {
				debug(element.id);
				if(element.id === "KumonCheckINApi"){
					debug(element.restarts);
					let restart_content = "Forever restart KumonCheckINApi script for " + element.restarts + " time. ";
					if (element.restarts >= 0) {
						axios.post(server_path + mail_api_path, {
							receivers: monitorConfig[process.env.NODE_ENV].developers.mail,
							subject: "System is restarted with code. ",
							content: restart_content,
						}).then(function(response) {
							// debug(response);
							debug("Forever restart KumonCheckINApi script for " + element.restarts + " time");
						}).catch(function(error) {
							debug(error);
						});
						
					}
				}
			});
		}
	});
};