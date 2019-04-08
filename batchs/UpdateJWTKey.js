
/**
 * 更新JWT key batch
 * @module batchs/UpdateJWTKey
 */

 /**
 * @param  {Object} {}
 */
module.exports = async () => {
	const axios = require("axios");
	const config = require("../Config");
	const local = config[process.env.NODE_ENV].policy + "://"+require('ip').address()+":" + config[process.env.NODE_ENV].nginx_port;
	const result = await axios.post(local+"/api/cust/jwt_key_create",{"data":{}});
	if(result.data.code.type ==="ERROR") throw Error(result.data.code.message);
};