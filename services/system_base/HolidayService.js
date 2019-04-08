/**
 * 工作日相關之商業邏輯
 * @module services/system_base/HolidayService
 */

"use strict";

/**
 * 查詢使用者
 * @param  {} req
 * @param  {} res
 * @see /api/staff/users/read
 */
module.exports.getPreviousWorkDay = async (req, res, next) => {

    try {
        const format = require("date-format");
        const messageHandler = require("../../helper/MessageHandler");
        const viewHolidayRepository = require("../../repositories/system_base/ViewHolidayRepository");

        // check parameters
        if (!req.body.hasOwnProperty("data")) throw (new Error("ERROR_LACK_OF_PARAMETER"));

        // get data
        const date = await viewHolidayRepository.getNegWorkDay((new Date()), 1);

        res.send({
            "code": messageHandler.infoHandler("INFO_READ_DATA_SUCCESS"),
            "data": format("yyyy/MM/dd",date),
        });
    }
    catch (err) { next(err); }
};
