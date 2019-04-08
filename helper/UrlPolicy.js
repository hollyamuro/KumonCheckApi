/**
 * 不須認證的URL列表
 * @module helper/UrlPolicy
 */

"use strict";

module.exports = [
    "/",
	"/version",
	"/api/cust/login",
	"/api/staff/users/login",
	"/api/cust/jwtverify",
    "/api/staff/users/verify",
    "/api/cust/matching",
    "/api/cust/verify",
    "/api/cust/verify_password",
    "/api/cust/url_check",
    "/api/staff/custs/reset_password",
    "/api/cust/jwt_key_create",
    "/api/staff/custs/import",	
	/*Add path which do not need auth*/
];