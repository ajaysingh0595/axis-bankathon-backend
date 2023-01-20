const Joi = require("joi")
const settings = require("../config/settings")
const user_controller = require("../controllers/user_controller")
const response_handler = require("../helper/middleware/response_handler")

module.exports = [
  {
    method: "GET",
    path: settings.API_V1_BASE + "/user/profile",
    handler: user_controller.user_profile,
    options: {
      description: "get user profile",
      notes: "get user profile",
      tags: ["api", "user", "profile"],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
]
