let kalerya = require("../helper/vendor/kalerya")
let login = {
  otp: async (mobile) => {
    return await kalerya.sendOtp(mobile).catch((e) => {
      console.log({ category: "error", details: e })
      throw e
    })
  },
  verify_otp: async (verification_meta) => {
    return await kalerya.verifyOtp(verification_meta).catch((e) => {
      console.log({ category: "error", details: e })
      throw e
    })
  },
}

module.exports = login
