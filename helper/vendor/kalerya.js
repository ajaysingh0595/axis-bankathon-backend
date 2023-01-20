let settings = require("../../config/settings")
const fetch = require("node-fetch")
module.exports = {
  sendOtp: async (mobile) => {
    let data = {
      flow_id: settings.login.FLOW_ID,
      to: {
        mobile: `+91${mobile}`,
      },
    }
    const response = await fetch(`${settings.SMS_URL}/verify`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "api-key": settings.login.OTP_API,
      },
    })
    const Res = await response.json()
    return Res
  },

  verifyOtp: async (data) => {
    const response = await fetch(`${settings.SMS_URL}/verify/validate`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "api-key": settings.login.OTP_API,
      },
    })
    const Res = await response.json()
    return Res
  },
}
