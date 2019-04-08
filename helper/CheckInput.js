/**
 * 系統輸入資料控管
 * @module helper/CheckInput
 */

"use strict";

/**
 * 系統權限控管
 * @param  {} req
 * @param  {} res
 * @param  {} next
 */
module.exports = async (req, res, next) => {

	// const debug = require("debug")("KumonCheckINApi:CheckInput");
	try{
        const InputData = req.body.data;
		const InputDataRegexp = /['"/*\\]/;

		if(Object.prototype.hasOwnProperty.call(req.body, "data")){
			Object.keys(InputData).forEach(element => {
                if(typeof(InputData[element])==="number"){
                    InputData[element] = InputData[element].toString();
                }
                if(typeof(InputData[element])==="object"){
                    for(let i=0; i<InputData[element].length;i++){
                        if(InputData[element][i].search(InputDataRegexp) >= 0){
                            throw(new Error("ERROR_INVAID_DATA"));
                        }
                    }
                }
                else{
                    if(InputData[element].search(InputDataRegexp) >= 0){
                        throw(new Error("ERROR_INVAID_DATA"));
                    }
                }      
			});
		}
		next();
	}catch(err){
		next(err);
	}
};
