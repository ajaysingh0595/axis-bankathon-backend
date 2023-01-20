let logger = require("../../services/logger").requestLogger
module.exports = {
  success: (req, data, msg, h) => {
    let response = {
      success: true,
      message: msg,
      statusCode: 200,
    }
    if (
      !Array.isArray(data) &&
      data?.hasOwnProperty("pages") &&
      data?.hasOwnProperty("limit")
    ) {
      response = { ...response, ...data }
    } else {
      response["data"] = data
    }
    logger(req, 200)
    return h.response(response).code(200)
  },
  error: (req, msg, data, h) => {
    logger(req, 400)
    return h
      .response({
        success: false,
        data: data,
        message: msg,
      })
      .code(400)
  },
  send_error: (req, error_code, msg, data, h) => {
    logger(req, error_code)
    return h
      .response({
        success: false,
        data: data,
        message: msg,
      })
      .code(error_code)
  },
  not_authorized: (req, h) => {
    logger(req, 401)
    return h
      .response({
        success: false,
        message: `Missing authentication`,
        statusCode: 401,
      })
      .code(401)
      .takeover()
  },
  badRequest: (req, h, err) => {
    logger(req, 400)
    return h
      .response({
        success: false,
        message: `ROUTE_ERROR: ${err.message}`,
        statusCode: 400,
        // message: `ROUTE_ERROR: ${err.details[0].message}`
      })
      .code(400)
      .takeover()
  },
  redirectUrl: (req, url, h) => {
    logger(req, 400)
    return h.redirect(url)
  },
  bajaj_webhook_success: (req, is_success, message, data, error, h) => {
    logger(req, 200)
    return h
      .response({
        success: is_success,
        message: message,
        data: data,
        error: error,
      })
      .code(200)
  },
  bajaj_login_success: (req, is_success, message, auth_token, error, h) => {
    logger(req, 200)
    return h
      .response({
        success: is_success,
        message: message,
        auth_token,
        error: error,
      })
      .code(200)
  },
}
