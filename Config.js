/**
 * 系統設定檔
 * @module Config
 */

"use strict";

module.exports = {

	production: {},
	development: {},
	debug: {
		version: "0.0.0",
		policy: "http",
		nginx_port: 3001,
		port: 3001,

		/* Database setting */
		database_config: {
			KumonCheckINWeb: {
				database: "KUMONCHICKIN",
				username: "apuser",
				password: "Elane1108",
				options: {
					host: "localhost",
					dialect: "mssql",
					pool: { max: 5, min: 0, idle: 10000 },
					operatorsAliases: false
				}
			},
		},
		KumonCheckInWeb: {
			host: "localhost",    //for local dev
			port: "8084",
			policy: "http",
		},
		Cust_MailServer: {
			//對外mail server
			host: "localhost",
			port: "8008",
			policy: "http",
			api: "api/mail_controller/send/",
		}
	},
};