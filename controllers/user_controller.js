let user_service = require("../services/user")
const response_handler = require("../helper/middleware/response_handler")
/*
 * @params
 * response_handler(REQ, OBJECT, MESSAGE, h)
 */

module.exports = {
  create_account: async function (req, h) {
    let payload = req.payload
    let response = await user_service.create_account(payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  user_profile: async function (req, h) {
    let user_id = req.auth.credentials.id
    let response = await user_service.user_profile(user_id)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
}
