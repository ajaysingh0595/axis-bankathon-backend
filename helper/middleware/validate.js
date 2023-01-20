let settings = require("./../../config/settings")
const auth = require("../../services/auth")
let o = {
  jwt: async function (decoded, request, h) {
    // do your checks to see if the person is valid
    console.log(decoded)
    return { valid: true }
  },
  fource_update: (buildNumber) => {
    let update_type = 1
    console.log(buildNumber, typeof buildNumber)
    if (settings.STORE_APP_BUILD_NUMBER_FORCED > Number(buildNumber)) {
      update_type = 3
    } else if (
      settings.STORE_APP_BUILD_NUMBER_RECOMMENDED > Number(buildNumber)
    ) {
      update_type = 2
    }
    return update_type
  },
  validate_apikey: (apiKey) => {
    if (settings.APP_ACCESS_API_KEY == apiKey) {
      return true
    } else {
      return false
    }
  },
  validate_webhook_apikey: async (apiKey, h) => {
    try {
      let is_valid = await auth.verify_webhook_token(apiKey)
      return is_valid
    } catch (e) {
      console.error("error", e.message)
      return false
    }
  },
  validation_allow_bajaj: (p) => {
    let path = ["/api/core-service/v1/webhook/bajaj/loan-application"]
    return path.includes(p)
  },
}

module.exports = o
