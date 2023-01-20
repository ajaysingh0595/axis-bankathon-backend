let auth = require("../services/auth")
const response_handler = require("../helper/middleware/response_handler")
/*
 * @params
 * response_handler(REQ, OBJECT, MESSAGE, h)
 */

module.exports = {
  login: async function (req, h) {
    let payload = {
      ...req.payload,
      platform_id: req.headers.platform_id,
    }
    let response = await auth.login(payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  refresh_token: async function (req, h) {
    let response = await auth.refresh_token(req)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  verify_login: async function (req, h) {
    let payload = req.payload
    let response = await auth.verify_login(req, payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }

    return response_handler.success(req, response.result, response.msg, h)
  },
  register: async function (req, h) {
    let payload = req.payload
    let response = await auth.login(payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
}
