const Joi = require("joi")
const settings = require("../config/settings")
const m_constant = require("../helper/constants/message")
const regex = require("../helper/constants/regex")
const auth_controller = require("../controllers/auth_controller")
const user_controller = require("../controllers/user_controller")
const response_handler = require("../helper/middleware/response_handler")

module.exports = [
  {
    method: "POST",
    path: settings.API_V1_BASE + "/auth/create-account",
    handler: user_controller.create_account,
    options: {
      auth: false,
      description: "create an account",
      notes: "create an account",
      tags: ["api", "account"],
      validate: {
        payload: Joi.object({
          username: Joi.string().alphanum().required(),
          full_name: Joi.string().required(),
          email: Joi.string()
            .required()
            .regex(regex.EMAIL)
            .error((e) => {
              return {
                message: m_constant.USER.ROUTER_ERRORS.ENTER_VALID_EMAIL,
              }
            }),
          mobile: Joi.string()
            .required()
            .regex(regex.MOBILE)
            .error((e) => {
              return {
                message: m_constant.USER.ROUTER_ERRORS.ENTER_VALID_MOBILE,
              }
            }),
          password: Joi.string().min(6).max(50).required(),
        }).required(),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: "POST",
    path: settings.API_V1_BASE + "/auth",
    handler: auth_controller.login,
    options: {
      auth: false,
      description: "login with username and password",
      notes: "login with username and password",
      tags: ["api", "auth"],
      validate: {
        payload: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }).required(),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: "PUT",
    path: settings.API_V1_BASE + "/auth/logout",
    handler: auth_controller.refresh_token,
    options: {
      description: "user logged out",
      notes: "user logged out",
      tags: ["api", "auth"],
      validate: {
        failAction: response_handler.badRequest,
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        options: {
          allowUnknown: true,
        },
      },
    },
  },
]
