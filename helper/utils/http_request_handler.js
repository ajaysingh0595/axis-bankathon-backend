let settings = require("../../config/settings")
const fetch = require("node-fetch")

module.exports = {
  post: async (url, body, headers = { content_type: "application/json" }) => {
    let result = {
      is_error: false,
      msg: "OK",
      result: {},
    }
    try {
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
      })

      const data = await response.json()
      result.result = data
    } catch (e) {
      console.error(e)
      result.msg = e.message
      result.is_error = true
    }
    return result
  },
  get: async (url, headers = { content_type: "application/json" }) => {
    let result = {
      is_error: false,
      msg: "OK",
    }
    try {
      const response = await fetch(url, {
        method: "get",
        headers: headers,
      })
      const data = await response.json()
      result.response = data
      result.result = data.data
    } catch (e) {
      console.error(e)
      result.msg = e.message
      result.is_error = true
    }
    return result
  },
  get_list: async (url, headers = { content_type: "application/json" }) => {
    let result = {
      is_error: false,
      msg: "OK",
    }
    try {
      const response = await fetch(url, {
        method: "get",
        headers: headers,
      })
      const data = await response.json()

      result.result = data
    } catch (e) {
      console.error(e)
      result.msg = e.message
      result.is_error = true
    }
    return result
  },
  put: async (url, body, headers) => {
    let result = {
      is_error: false,
      msg: "OK",
    }

    try {
      const response = await fetch(url, {
        method: "put",
        body: JSON.stringify(body),
        headers: headers,
      })
      const data = await response.json()

      result.body = data
    } catch (e) {
      console.error(e)
      result.msg = e.message
      result.is_error = true
    }
    return result
  },
}
