
/**
 * Holidays 之資料存取層 
 * @module repository/system_base/ViewHolidayRepository
 */

"use strict";

/**
 * 取date之後第offset個工作日
 * @param  {Date}   date 日期
 * @param  {Number} offset 正數，表示(正)位移量
 * @return {Date}   date之後第offset個工作日
 */
module.exports.getWorkDay = function (date, offset) {

    try {

        const format = require("date-format");
        const ormDB = require("../../helper/OrmDB");
        const viewHolidayModule = require("../../modules/system_base/ViewHolidayModule");

        //return new Promise(function(resolve, reject){
        return new Promise(function (resolve) {
            //(0) check connection
            ormDB.KumonCheckINWeb.authenticate()
                //(1) get holiday list
                .then(() => {
                    return viewHolidayModule.findAll({
                        attributes: [
                            [ormDB.sequelize.fn("DISTINCT", ormDB.sequelize.col("Hdate")), "Hdate"],
                        ],
                        distinct: "Hdate",
                        where: {
                            "Hdate": { [ormDB.op.gte]: format("yyyy/MM/dd", new Date(new Date(date).toLocaleDateString())) },
                            "Nation": "TWD",
                        },
                        order: ["Hdate"],
                        raw: true,
                    });
                })
                //(2) return
                .then((h) => {

                    let holiday_map = {};
                    for (let i = 0; i < h.length; i++) {
                        let key = format("yyyy/MM/dd", new Date(new Date(h[i]["Hdate"]).toLocaleDateString()));
                        if (!holiday_map.hasOwnProperty(key)) {
                            holiday_map[key] = key;
                        }
                    }

                    if (h.length > 0) {
                        let c = 0;
                        let org_date = date;
                        do {

                            //find nearest not holiday date
                            while (holiday_map.hasOwnProperty(format("yyyy/MM/dd", new Date(new Date(date).toLocaleDateString())))) {
                                date.setDate(date.getDate() + 1);
                            }

                            //if offset is achieved, stop
                            if (c >= offset) break;

                            //increase one
                            c++;
                            date.setDate(date.getDate() + 1);

                        } while (c <= offset);

                        resolve(date);
                    }
                    else {
                        resolve(date);
                    }
                })
                .catch((err) => {
                    throw err;
                });
        });
    }
    catch (err) {
        throw err;
    }
};

/**
 * 取date之前第offset個工作日
 * @param  {Date}   date 日期
 * @param  {Number} offset 正數，表示(負)位移量
 * @return {Date}   date之前第offset個工作日
 */
module.exports.getNegWorkDay = function (date, offset) {

    try {

        const format = require("date-format");
        const ormDB = require("../../helper/OrmDB");
        const viewHolidayModule = require("../../modules/system_base/ViewHolidayModule");

        //return new Promise(function(resolve, reject){
        return new Promise(function (resolve) {
            //(0) check connection
            ormDB.KumonCheckINWeb.authenticate()
                //(1) get holiday list
                .then(() => {
                    return viewHolidayModule.findAll({
                        attributes: [
                            [ormDB.sequelize.fn("DISTINCT", ormDB.sequelize.col("Hdate")), "Hdate"],
                        ],
                        distinct: "Hdate",
                        where: {
                            "Hdate": { [ormDB.op.lte]: format("yyyy/MM/dd", new Date(new Date(date).toLocaleDateString())) },
                            "Nation": "TWD",
                        },
                        order: ormDB.sequelize.literal("Hdate DESC"),
                        raw: true,
                    });
                })
                //(2) return
                .then((h) => {

                    let holiday_map = {};
                    for (let i = 0; i < h.length; i++) {
                        let key = format("yyyy/MM/dd", new Date(new Date(h[i]["Hdate"]).toLocaleDateString()));
                        if (!holiday_map.hasOwnProperty(key)) {
                            holiday_map[key] = key;
                        }
                    }

                    if (h.length > 0) {

                        let c = 0;
                        do {
                            //find nearest not holiday date
                            while (holiday_map.hasOwnProperty(format("yyyy/MM/dd", new Date(new Date(date).toLocaleDateString())))) {
                                date.setDate(date.getDate() - 1);
                            }

                            //if offset is achieved, stop
                            if (c >= offset) break;

                            //increase one
                            c++;
                            date.setDate(date.getDate() - 1);

                        } while (c <= offset);

                        resolve(date);
                    }
                    else {
                        resolve(date);
                    }
                })
                .catch((err) => {
                    throw err;
                });
        });
    }
    catch (err) {
        throw err;
    }
};
