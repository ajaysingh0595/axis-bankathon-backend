const fetch = require("node-fetch")
let settings = require("../../config/settings")
let obj = {
  google_short_url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${settings.FIREBASE_API_KEY}`,
  short_link: async (url) => {
    let formData = {
      longDynamicLink: "https://vestit.page.link/?link=" + url,
    }
    let response = await fetch(obj.google_short_url, {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((r) => {
        return r.text()
      })
      .catch((e) => {
        throw e
      })
    let GATEWAY_RESPONSE = JSON.parse(response)
    return GATEWAY_RESPONSE
  },
}
module.exports = obj
