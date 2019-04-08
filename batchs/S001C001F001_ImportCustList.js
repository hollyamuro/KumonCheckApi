/**
 * 取得最新客戶資料batch
 * @module batchs/S001C001F001_ImportCustList
 */

/**
 * @param  {Object} logger 寫batch log用
 */
module.exports = async (logger) => {
	const axios = require("axios");
	const config = require("../Config");
	const local = config[process.env.NODE_ENV].policy + "://"+require('ip').address()+":" + config[process.env.NODE_ENV].nginx_port;
	const result = await axios.post(local+"/api/staff/custs/import",{"data":{}});
	if(result.data.code.type ==="ERROR") throw Error(result.data.code.message);
};