/**
 * 銀行身份用相關之商業邏輯
 * @module services/KumonCheckINBankWebService
 */

"use strict";

/**
 * 擔保品 Holding 
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getSafekeepingHolding = async (req, res, next) => {
	try {

		const axios = require("axios");
		const dateFormat = require("date-format");
		const math = require("mathjs");
		const numeral = require("numeral");
		const config = require("../Config");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");

		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("begin_pdate") || req.body.data.begin_pdate === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("end_pdate") || req.body.data.end_pdate === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("isin")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("client_account")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("begin_mdate")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("end_mdate")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;

			const data = await axios.post(local + "/apis/safekeeping/getholding", {
				"beg_position": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.begin_pdate)),
				"end_position": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.end_pdate)),
				"isin": req.body.data.isin,
				"clientaccount": req.body.data.client_account,
				"begin_maturity": (req.body.data.begin_mdate === "") ? "" : dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.begin_mdate)),
				"end_maturity": (req.body.data.end_mdate === "") ? "" : dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.end_mdate)),
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			const return_data =
				(!data.data.data) ? [] : data.data.data.map((r) => ({
					"Position Date": (r.PositionDate === "") ? "" : dateFormat.asString("yyyy/MM/dd", new Date(r.PositionDate)),
					"ID": r.ID,
					"Client Account": r.ClientAccount,
					"ISIN Code": r.ProductCode,
					"Product Name": r.product_name,
					"Nominal": numeral(math.round(r.Quantity, 0)).format("0,0"),
					"Currency": r.Currency,
					"Ref. Price": numeral(math.round(math.multiply(r.ReferencePrice, 100), 5)).format("0,0.00000") + "%",
					"Hair Cut": numeral(math.round(r.haircut, 5)).format("0,0.00000") + "%",
					"Reference Value": numeral(math.round(r.ReferenceValue, 2)).format("0,0.00"),
					"Maturity Date": (r.MaturityDate === "") ? "" : dateFormat.asString("yyyy/MM/dd", new Date(r.MaturityDate)),
				}));

			res.send({
				"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": return_data,
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch (err) { next(err); }
};

/**
 * 擔保品 Balance
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getSafekeepingBalance = async (req, res, next) => {
	try {

		const axios = require("axios");
		const dateFormat = require("date-format");
		const math = require("mathjs");
		const numeral = require("numeral");
		const config = require("../Config");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");

		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("begin_pdate") || req.body.data.begin_pdate === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("end_pdate") || req.body.data.end_pdate === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("client_account")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;

			const data = await axios.post(local + "/apis/safekeeping/getbalance", {
				"beg_position": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.begin_pdate)),
				"end_position": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.end_pdate)),
				"clientaccount": req.body.data.client_account,
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			const return_data =
				(!data.data.data) ? [] : data.data.data.map((r) => ({
					"Position Date": (r.PositionDate === "") ? "" : dateFormat.asString("yyyy/MM/dd", new Date(r.PositionDate)),
					"ID": r.ID,
					"Client Account": r.ClientAccount,
					"Currency": r.Currency,
					"Amount": numeral(math.round(r.Amount, 2)).format("0,0.00"),
				}));

			res.send({
				"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": return_data,
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	}
	catch (err) { next(err); }
};
