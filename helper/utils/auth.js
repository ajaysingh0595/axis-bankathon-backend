let models = require("../../models")
let u_const = require("../constants/user")
const settings = require("../../config/settings")
let auth = require("../../services/auth")
let ERROR_CODE = require("../constants/error_code")
module.exports = {
  bypass_validate: async (mobile) => {
    let RESPONSE = {
      is_error: false,
      msg: "Ok",
      result: { is_bypass_allowed: false },
    }
    try {
      if (
        settings.MODE === "dev" &&
        u_const.OTP_DO_NOT_SENT_NUMBER.indexOf(mobile) >= 0
      ) {
        // checks apply
        RESPONSE.result.is_bypass_allowed = true
      }
    } catch (e) {
      console.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
}
