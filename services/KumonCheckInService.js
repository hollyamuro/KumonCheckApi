/**
 * 一般客戶用相關之商業邏輯
 * @module services/KumonCheckINCustWebService
 */

"use strict";

/**
 * 取得首頁客戶概況
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getDashboard = async (req, res, next) => {
	try {
		const axios = require("axios");
		const dateFormat = require("date-format");
		const config = require("../Config");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");

		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(req.body.data.account !== req.body.requester) throw (new Error("ERROR_UNAUTHORIZED"));
			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;
			
			const data = await axios.post(local + "/apis/Coupon/payment", {
				"account_no": req.body.data.account,
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			const return_data =
				(!data.data.data) ? [] : data.data.data.map((r) => ({
					"Payment Date (Estimate)": dateFormat.asString("yyyy/MM/dd", new Date(r.paydate)),
					"Product Code": r.isin,
					"Product Name": r.productname,
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
 * 取得部位資料
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getKumonCheckINPosition = async (req, res, next) => {
	try {
		const axios = require("axios");
		const dateFormat = require("date-format");
		const numeral = require("numeral");
		const math = require("mathjs");
		const config = require("../Config");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");

		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("query_date") || req.body.data.query_date === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(req.body.data.account !== req.body.requester) throw (new Error("ERROR_UNAUTHORIZED"));
			// check: can not query future data
			if (new Date(new Date(req.body.data.query_date).toLocaleDateString()) > new Date()) throw (new Error("ERROR_OVERFLOW_DATE"));

			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;
			const data = await axios.post(local + "/apis/position/getposition", {
				"account_no": req.body.data.account,
				"valuedate": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.query_date)),
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			const return_data = {
				cash: (!data.data.data || !data.data.data.cash) ? [] : data.data.data.cash.map((r) => ({
					"Currency": r.ccy,
					"Balance": numeral(math.round(r.balance, 2)).format("0,0.00"),
				})),
				bond: (!data.data.data || !data.data.data.bond) ? [] : data.data.data.bond.map((r) => ({
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Currency": r.ccy,
					"Nominal": numeral(math.round(r.nominal, 0)).format("0,0"),
					"Reference Price": numeral(math.round(math.multiply(r.ref_price, 100), 5)).format("0,0.00000") + "%",
					"Reference Value": numeral(math.round(r.ref_value, 2)).format("0,0.00"),
				})),
				rp: (!data.data.data || !data.data.data.rp) ? [] : data.data.data.rp.map((r) => ({
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Currency": r.ccy,
					"Nominal": numeral(math.round(r.nominal, 0)).format("0,0"),
					"Reference Price": numeral(math.round(math.multiply(r.ref_price, 100), 5)).format("0,0.00000") + "%",
					"Reference Value": numeral(math.round(r.ref_value, 2)).format("0,0.00"),
				})),
				rs: (!data.data.data || !data.data.data.rs) ? [] : data.data.data.rs.map((r) => ({
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Currency": r.ccy,
					"Nominal": numeral(math.round(r.nominal, 0)).format("0,0"),
					"Reference Price": numeral(math.round(math.multiply(r.ref_price, 100), 5)).format("0,0.00000") + "%",
					"Reference Value": numeral(math.round(r.ref_value, 2)).format("0,0.00"),
				})),
			};

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
 * 取得已出帳資料
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getKumonCheckINChargeOffHistory = async (req, res, next) => {
	try {
		const axios = require("axios");
		const dateFormat = require("date-format");
		const config = require("../Config");
		const numeral = require("numeral");
		const math = require("mathjs");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");

		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("begin_date") || req.body.data.begin_date === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("end_date") || req.body.data.end_date === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(req.body.data.account !== req.body.requester) throw (new Error("ERROR_UNAUTHORIZED"));
			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;

			const data = await axios.post(local + "/apis/history/getlist", {
				"account_no": req.body.data.account,
				"begindate": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.begin_date)),
				"enddate": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.end_date)),
				"status": "1"
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			const return_data = {
				cash: (!data.data.data || !data.data.data.cash) ? [] : data.data.data.cash.map((r) => ({
					"Trade Date": dateFormat.asString("yyyy/MM/dd", new Date(r.tradedate)),
					"Value Date": dateFormat.asString("yyyy/MM/dd", new Date(r.valuedate)),
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Description": r.description,
					"Currency": r.ccy,
					"Amount": numeral(math.round(r.amount, 2)).format("0,0.00"),
				})),
				holdings: (!data.data.data || !data.data.data.holdings) ? [] : data.data.data.holdings.map((r) => ({
					"Trade Date": dateFormat.asString("yyyy/MM/dd", new Date(r.tradedate)),
					"Value Date": dateFormat.asString("yyyy/MM/dd", new Date(r.valuedate)),
					"Buy/Sell": r.buysell,
					"Product Type": r.product,
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Currency": r.ccy,
					"Nominal": numeral(math.round(r.nominal, 2)).format("0,0.00"),
				})),
			};

			res.send({
				"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": return_data,
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	} catch (err) { next(err); }
};

/**
 * 取得未出帳資料
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getKumonCheckINNotChargeOffHistory = async (req, res, next) => {
	try {
		const axios = require("axios");
		const dateFormat = require("date-format");
		const config = require("../Config");
		const numeral = require("numeral");
		const math = require("mathjs");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");
		
		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("begin_date") || req.body.data.begin_date === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("end_date") || req.body.data.end_date === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(req.body.data.account !== req.body.requester) throw (new Error("ERROR_UNAUTHORIZED"));
			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;

			const data = await axios.post(local + "/apis/history/getlist", {
				"account_no": req.body.data.account,
				"begindate": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.begin_date)),
				"enddate": dateFormat.asString("yyyy/MM/dd", new Date(req.body.data.end_date)),
				"status": "2"
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			const return_data = {
				cash: (!data.data.data || !data.data.data.cash) ? [] : data.data.data.cash.map((r) => ({
					"Trade Date": dateFormat.asString("yyyy/MM/dd", new Date(r.tradedate)),
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Description": r.description,
					"Currency": r.ccy,
					"Amount": numeral(math.round(r.amount, 2)).format("0,0.00"),
				})),
				holdings: (!data.data.data || !data.data.data.holdings) ? [] : data.data.data.holdings.map((r) => ({
					"Trade Date": dateFormat.asString("yyyy/MM/dd", new Date(r.tradedate)),
					"Buy/Sell": r.buysell,
					"Product Type": r.product,
					"Product Code": r.isin,
					"Product Name": r.productname,
					"Currency": r.ccy,
					"Nominal": numeral(math.round(r.nominal, 2)).format("0,0.00"),
				})),
			};

			res.send({
				"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": return_data,
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	} catch (err) { next(err); }
};

/**
 * 取得對帳單
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports.getStatementReport = async (req, res, next) => {
	try {
		const axios = require("axios");
		const config = require("../Config");
		const messageHandler = require("../helper/MessageHandler");
		const utility = require("../helper/Utility");

		// check parameters
		if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("account") || req.body.data.account === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("year") || req.body.data.year === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		if (!req.body.data.hasOwnProperty("month") || req.body.data.month === "") throw (new Error("ERROR_LACK_OF_PARAMETER"));
		let isInputDataVaild = await utility.checkInputData(req.body.data);
		if(isInputDataVaild){
			if(req.body.data.account !== req.body.requester) throw (new Error("ERROR_UNAUTHORIZED"));
			// get data from api
			const local = config[process.env.NODE_ENV].KumonCheckINBackend.policy + "://" +
				config[process.env.NODE_ENV].KumonCheckINBackend.host + ":" +
				config[process.env.NODE_ENV].KumonCheckINBackend.port;
			const data = await axios.post(local + "/apis/report/getreport", {
				"account_no": req.body.data.account,
				"year": req.body.data.year,
				"month": req.body.data.month,
			});

			if (data.data._server.result !== "OK") throw (new Error("ERROR_READ_DATA_FAIL"));

			res.send({
				"code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
				"data": (!data.data.data || !data.data.data.data) ? [] : data.data.data.data,
			});
		}else{
			throw(new Error("ERROR_BAD_REQUEST"));
		}
	} catch (err) { next(err); }
}; 