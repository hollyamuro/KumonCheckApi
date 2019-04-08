/**
 * 前端Request JWT檢測
 * @module helper/JwtCheck
 */

"use strict";

/**
 * JWT檢測
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports = async (req, res, next) => {

    const debug = require("debug")("KumonCheckINApi:JwtCheck");
    const config = require("../Config");
    const axios = require("axios");
    const requestUrl = req.url.split("?")[0];
    const skipAuthUrls = require("./UrlPolicy");

	try{
        debug(req.body);
        if(skipAuthUrls.indexOf(requestUrl) > -1){ 
            next();
        }
        else{
            const local = config[process.env.NODE_ENV].policy + "://"+require('ip').address()+":" + config[process.env.NODE_ENV].nginx_port;

            if(!req.body.hasOwnProperty("token")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
            if(!req.body.hasOwnProperty("system")) throw(new Error("ERROR_LACK_OF_PARAMETER"));
            
            if(req.body.system === "KumonCheckINCustWeb"){
                const jwt_user_profile = await axios.post(local + "/api/cust/jwtverify", {
                    "data":req.body.data, 
                    "requester":req.body.requester,
                    "token": req.body.token,
                    "system": req.body.system,
                    });
                debug(jwt_user_profile.data.code);

                if(jwt_user_profile.data.code.type === "ERROR") throw(new Error("ERROR_UNAUTHORIZED"));
                next();
            }else if(req.body.system === "KumonCheckINWeb"){
                const jwt_user_profile = await axios.post(local + "/api/staff/users/verify", {
                    "data":req.body.data, 
                    "requester":req.body.requester,
                    "token": req.body.token,
                    "system": req.body.system,
                    });
                debug(jwt_user_profile.data.code);

                if(jwt_user_profile.data.code.type === "ERROR") throw(new Error("ERROR_UNAUTHORIZED"));
                next();
            }else{
                next();
            }
        }
        // next();

	}catch(err){
		debug(err);
		next(err);
	}
};
