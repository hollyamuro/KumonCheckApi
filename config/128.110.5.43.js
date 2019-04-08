/**
 * 系統設定檔
 * @module Config
 */

"use strict";

module.exports = {
	production: {},
	development: {
		version: "1.0.0",
		policy: "https",
		nginx_port: 3051,
		port: 3001,

		/* Database setting */
		database_config: {
			KumonCheckINWeb: {
				database: "KumonCheckINWeb",
				username: "apowner",
				password: "ok1234",
				options: {
					host: "128.110.5.43",
					dialect: "mssql",
					pool: { max: 5, min: 0, idle: 10000 },
					operatorsAliases: false
				}
			},
			BondGol: {
				database: "bond_gol_uat",
				username: "apowner",
				password: "ok1234",
				options: {
					host: "128.110.5.43",
					dialect: "mssql",
					pool: { max: 5, min: 0, idle: 10000 },
					operatorsAliases: false
				}
			},
		},
		IntegratedProxyService_api: {
			host: "128.110.5.43",
			port: "8018",
			policy: "https",
		},
		JwtService_api: {
			host: "128.110.5.43",
			port: "8016",
			policy: "https",
		},
		KumonCheckINBackend: {
			//固收主機
			host: "128.110.5.45",
			port: "80",
			policy: "http",
		},
		KumonCheckINCustWeb: {
			domain:"custody-test.sec",
			host: "218.32.237.86",
			port: "8086",
			policy: "https",
		},
		Cust_MailServer: {
			//對外mail server
			from:"SinoPac Securities Custody Service <KumonCheckIN_service@sinopac.com>",
			host: "128.110.5.43",
			port: "8018",
			policy: "https",
			api: "api/mail_controller/external_send",
		},
		local_MailServer: {
		    //對內mail server
			from:"SinoPac Securities Custody Service <KumonCheckIN_service@sinopac.com>",
			host: "128.110.5.43",
			port: "8018",
			policy: "https",
			api: "api/mail_controller/send",
		}
	},
	debug: {},
};