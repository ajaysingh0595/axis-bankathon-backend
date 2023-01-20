let settings = require('../../config/settings')
const fetch = require('node-fetch')

let o = {
  sms: async (mobile, sms, dlt_te_id) => {
    let formData =
      'mobiles=' +
      mobile +
      '&authkey=' +
      settings.SMS.MSG91.api_key +
      '&route=4&sender=' +
      settings.SMS.MSG91.sender +
      '&message=' +
      encodeURIComponent(sms) +
      '&country=91'
    let GATEWAY_RESPONSE = await fetch(
      `https://control.msg91.com/api/sendhttp.php?DLT_TE_ID=${dlt_te_id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      }
    )
      .then(r => {
        return r.text()
      })
      .catch(e => {
        throw e
      })

    if (typeof GATEWAY_RESPONSE == 'object') {
      GATEWAY_RESPONSE = JSON.parse(GATEWAY_RESPONSE)

      if (GATEWAY_RESPONSE.type == 'error') {
        throw GATEWAY_RESPONSE.message
      }
    } else {
      console.log('SMS RESPONSE', GATEWAY_RESPONSE)
      return true
    }
  },
  otp: async mobile => {
    let formData =
      'DLT_TE_ID=1307161685028877320&otp_length=4&otp_expiry=5&sender=WPIDGE&message=' +
      encodeURIComponent(settings.SMS.MSG91.otp_template) +
      '&mobile=+91' +
      mobile +
      '&authkey=' +
      settings.SMS.MSG91.api_key
    let response = await fetch('https://control.msg91.com/api/sendotp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    }).catch(e => {
      throw e
    })

    let dd = await response.text()
    try {
      let d = JSON.parse(dd)
      if (d.type == 'error') throw d.message

      return d
    } catch (e) {
      let vendor_error = dd
      throw `Vendor Error: ${vendor_error}`
    }
  },
  // eslint-disable-next-line no-unused-vars
  otp_resend: async (mobile, type) => {
    let retry_type = 'text' //voice;
    let formData = `retrytype=${retry_type}&mobile=+91${mobile}&authkey=${settings.SMS.MSG91.api_key}`
    return await fetch('https://control.msg91.com/api/retryotp.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })
      .then(r => {
        return r.json()
      })
      .then(r => {
        if (r.type == 'error') throw r.message
        return r
      })
      .catch(e => {
        throw e
      })
  },
  verify_otp: async (mobile, otp) => {
    let formData = `authkey=${settings.SMS.MSG91.api_key}&mobile=+91${mobile}&otp=${otp}`
    return await fetch('https://control.msg91.com/api/verifyRequestOTP.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    })
      .then(r => {
        return r.json()
      })
      .then(r => {
        if (r.type == 'error') {
          //throw r.message;
          if (r.message == 'already_verified') {
            return o
              .otp_resend(mobile, 'text')
              .then(r => {
                return r
              })
              .catch(e => {
                throw new Error(e)
              })
          } else {
            throw r.message
          }
        }

        return r
      })
      .catch(e => {
        throw e
      })
  }
}

module.exports = o
