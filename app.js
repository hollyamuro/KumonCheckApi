
/**
 * 封包處理
 * @module app
 */

"use strict";

/**
 * 封包處理
 */
const packageHandler = () => {

	const express = require("express");
	const path = require("path");
	const bodyParser = require("body-parser");
	let helmet = require("helmet");

	let app = express();

	/* setup morgan for log*/
	const fileStreamRotator = require("file-stream-rotator");
	const morgan = require("morgan");
	let accessLogStream = fileStreamRotator.getStream({
		filename: "log/log-%DATE%.log",
		frequency: "daily",
		verbose: false
	});
	morgan.token("req-body", function (req) { 
		return (req.url === "/api/staff/users/login" || req.url === "/api/cust/login" ) ? "" : JSON.stringify(req.body); 
	});
	app.use(morgan(":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\" :req-body",
		{ stream: accessLogStream, })
	);

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));

	/* Check Input Data */
	// app.use(require(path.resolve(__dirname,"./helper/CheckInput")));

	/* setup helmet */
	app.use(helmet());
	app.use(helmet.contentSecurityPolicy({
		directives: {
			defaultSrc:		["'self'"],
			scriptSrc:		["'self'"],
			styleSrc:		["'self'"],
			imgSrc:			["'self'"],
			frameSrc:		["'self'"],
			fontSrc:		["'self'"],
		}
	}));
	app.use(helmet.frameguard({ action: 'deny' }));

	/* setting api routers */
	require("./routes/ServiceRoute")(app);
	require("./routes/CustRoute")(app);
	require("./routes/StudentRoute")(app);
	require("./routes/StaffRoute")(app);

	// catch 404 and forward to error handler
	app.use((req, res, next) => {
		const error = require("./helper/KumonCheckInError");
		next(new error.NotFoundError());
	});

	// error handler
	app.use((err, req, res, next) => {
		const debug = require("debug")("KumonCheckInApi:app");
		const messageHandler = require("./helper/MessageHandler");
		debug((process.env.NODE_ENV !== "production") ? err.stack : "");

		// res.status(err.status || 500);
		res.send({ "code": messageHandler.errorHandler(err), "data": "", });
	});

	return app;
};

module.exports = packageHandler();
