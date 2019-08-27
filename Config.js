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
			KumonCheckIN: {
				database: "KUMONCHICK",
				username: "apuser",
				password: "1108",
				options: {
					host: "localhost",
					dialect: "mssql",
					pool: { max: 5, min: 0, idle: 10000 },
					operatorsAliases: false
				}
			},
		},
		KumonCheckINWeb: {
			host: "localhost",    //for local dev
			port: "8084",
			policy: "http",
		},
		Cust_MailServer: {
			//對外mail server
			host: "smtp.googlemail.com",
			port: 465,
			user: "transamsu@gmail.com",
			password: "855191108",
		}
	},
};