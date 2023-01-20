let settings = require("../../config/settings")
const fetch = require("node-fetch")
let sms_url = `https://enterprise.smsgupshup.com/GatewayAPI/rest`
let SMS_RES = {
  status: null,
  is_error: false,
  msg: "",
}
let o = {
  sms: async (mobile, text) => {
    let formData =
      "send_to=" +
      mobile +
      "&userid=" +
      settings.SMS.gupshup1.user_id +
      "&password=" +
      settings.SMS.gupshup1.password +
      "&format=JSON&method=sendMessage&msg=" +
      text +
      // encodeURIComponent(text) +
      "&v=1.1"

    let GATEWAY_RESPONSE = await fetch(sms_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((r) => {
        return r.text()
      })
      .catch((e) => {
        throw e
      })

    GATEWAY_RESPONSE = JSON.parse(GATEWAY_RESPONSE)
    if (typeof GATEWAY_RESPONSE == "object") {
      console.log(
        "SMS RESPONSE",
        GATEWAY_RESPONSE.response.status,
        GATEWAY_RESPONSE.response.id,
        GATEWAY_RESPONSE.response.details
      )
      if (GATEWAY_RESPONSE.response.status == "success") {
        SMS_RES.is_error = false
        SMS_RES.status = GATEWAY_RESPONSE.response.status
        SMS_RES.msg = o.parse_otp_error_msg(GATEWAY_RESPONSE.response.id)
        return SMS_RES
      } else {
        SMS_RES.is_error = true
        SMS_RES.msg = o.parse_otp_error_msg(GATEWAY_RESPONSE.response.id)
        return SMS_RES
      }
    } else {
      throw "parse error"
    }
  },
  otp: async (mobile, sms) => {
    let formData =
      "phone_no=" +
      mobile +
      "&userid=" +
      settings.SMS.gupshup.user_id +
      "&password=" +
      settings.SMS.gupshup.password +
      "&format=JSON&method=TWO_FACTOR_AUTH&msg=" +
      encodeURIComponent(sms) +
      "&otpCodeLength=4&otpCodeType=NUMERIC&v=1.1"
    // console.log(formData)
    let response = await fetch(sms_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((r) => {
        return r.text()
      })
      .catch((e) => {
        throw e
      })

    let GATEWAY_RESPONSE = JSON.parse(response)
    // console.log(GATEWAY_RESPONSE)
    if (typeof GATEWAY_RESPONSE == "object") {
      console.log(
        "SMS RESPONSE",
        GATEWAY_RESPONSE.response.status,
        GATEWAY_RESPONSE.response.id,
        GATEWAY_RESPONSE.response.details
      )
      if (GATEWAY_RESPONSE.response.status == "success") {
        SMS_RES.is_error = false
        SMS_RES.status = GATEWAY_RESPONSE.response.status
        SMS_RES.msg = o.parse_otp_error_msg(GATEWAY_RESPONSE.response.id)
        return SMS_RES
      } else {
        SMS_RES.is_error = true
        SMS_RES.msg = o.parse_otp_error_msg(GATEWAY_RESPONSE.response.id)
        return SMS_RES
      }
    } else {
      throw "parse error"
    }
  },
  // eslint-disable-next-line no-unused-vars
  otp_resend: async (mobile, type) => {
    let retry_type = "text" //voice;
    let formData = `retrytype=${retry_type}&mobile=+91${mobile}&authkey=${settings.SMS.MSG91.api_key}`
    return await fetch("https://control.msg91.com/api/retryotp.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((r) => {
        return r.json()
      })
      .then((r) => {
        if (r.type == "error") throw r.message
        return r
      })
      .catch((e) => {
        throw e
      })
  },
  verify_otp: async (mobile, otp) => {
    let formData =
      "phone_no=" +
      mobile +
      "&userid=" +
      settings.SMS.gupshup.user_id +
      "&password=" +
      settings.SMS.gupshup.password +
      "&format=JSON&method=TWO_FACTOR_AUTH&otp_code=" +
      otp +
      "&v=1.1"

    let response = await fetch(sms_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    })
      .then((r) => {
        return r.text()
      })
      .catch((e) => {
        throw e
      })
    let GATEWAY_RESPONSE = JSON.parse(response)
    if (typeof GATEWAY_RESPONSE == "object") {
      console.log(
        "SMS RESPONSE",
        GATEWAY_RESPONSE.response.status,
        GATEWAY_RESPONSE.response.id,
        GATEWAY_RESPONSE.response.details
      )
      if (GATEWAY_RESPONSE.response.status == "success") {
        SMS_RES.is_error = false
        SMS_RES.status = GATEWAY_RESPONSE.response.status
        SMS_RES.msg = o.parse_otp_error_msg(GATEWAY_RESPONSE.response.id)
        return SMS_RES
      } else {
        SMS_RES.is_error = true
        SMS_RES.status = GATEWAY_RESPONSE.response.id
        SMS_RES.msg = o.parse_otp_error_msg(GATEWAY_RESPONSE.response.id)
        return SMS_RES
      }
    } else {
      throw "parse error"
    }

    // let formData = `authkey=${settings.SMS.MSG91.api_key}&mobile=+91${mobile}&otp=${otp}`;
    // return await fetch("https://control.msg91.com/api/verifyRequestOTP.php", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: formData,
    // })
    //   .then((r) => {
    //     return r.json();
    //   })
    //   .then((r) => {
    //     if (r.type == "error") {
    //       //throw r.message;
    //       if (r.message == "already_verified") {
    //         return o
    //           .otp_resend(mobile, "text")
    //           .then((r) => {
    //             return r;
    //           })
    //           .catch((e) => {
    //             throw new Error(e);
    //           });
    //       } else {
    //         throw r.message;
    //       }
    //     }

    //     return r;
    //   })
    //   .catch((e) => {
    //     throw e;
    //   });
  },
  parse_otp_error_msg: (status) => {
    let msg = "opps otp is incorrect."
    if (status == 311) {
      msg = "This OTP does not exist."
    } else if (status == 309) {
      msg = "You have exceeded maximum number of attempts."
    } else if (status == 301) {
      msg = "OTP token has expired."
    } else if (status == 310) {
      msg = "This OTP is incorrect."
    } else if (status == 308) {
      msg = "You are re-trying too early. Please wait for some time."
    }
    return msg
  },
}
module.exports = o
