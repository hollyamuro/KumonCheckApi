/**
 * batch主程式
 * @module batchs/BatchMain
 */

/**
 * batch主程式
 */
module.exports = () => {
	try {
    
		const batchConfig = require("./BatchConfig");
		const cron = require("node-cron");
		const format = require("date-format");
		const log4js = require("log4js");        
		const logger = log4js.getLogger();
		log4js.configure({
			appenders: { batch_log: { type: "file", filename: "./log/batch_"+ format("yyyyMMdd",new Date()) +".log" } },
			categories: { default: { appenders: ["batch_log"], level: "trace" } }
		});

		//set up all schedule
		logger.info("[BATCH SETUP START]");
		for( let i = 0; i < batchConfig.length; i++){
			const fun = "./" + batchConfig[i].name;
			cron.schedule(batchConfig[i].time,()=>{
				try{
					logger.info("[S001C001F001_ImportCustList][START]");
					require(fun)(logger);
					logger.info("[S001C001F001_ImportCustList][END]");
				}catch(err){
					logger.error(err.stack);
				}
			});
		}
		logger.info("[BATCH SETUP FINISH]");
	}
	catch(err){
		throw(err);
	}
};