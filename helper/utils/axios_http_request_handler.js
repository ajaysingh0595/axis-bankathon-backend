const axios = require("axios")
module.exports = {
  post: async (
    url,
    body,
    headers = { headers: { "Content-Type": "application/json" } }
  ) => {
    let result = {
      is_error: false,
      msg: "OK",
      body: {},
    }
    try {
      await axios
        .post(url, body, headers)
        .then(function (response) {
          result.body = response?.data
        })
        .catch(function (error) {
          let error_obj = {
            status: error?.response?.status,
            path: error?.response?.request?.path,
            body: error?.response?.config?.data,
            message: error?.response?.data?.message,
          }
          console.error(error_obj)
          result.body = error.response.data
          throw Error(error.response.data.message)
        })
    } catch (e) {
      console.error(e)
      result.msg = e.message
      result.is_error = true
    }
    return result
  },
  get: async (url, headers = { "Content-Type": "application/json" }) => {
    let result = {
      is_error: false,
      msg: "OK",
    }
    try {
      await axios
        .get(url, headers)
        .then(function (response) {
          result.body = response.data
        })
        .catch(function (error) {
          let error_obj = {
            status: error?.response?.status,
            path: error?.response?.request?.path,
            body: error?.response?.config?.data,
            message: error?.response?.data?.message,
          }
          console.error(error_obj)
          throw Error(error.response.data.message)
        })
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
      // const response = await fetch(url, {
      //   method: "put",
      //   body: JSON.stringify(body),
      //   headers: headers,
      // })
      // const data = await response.json()
      // result.body = data
    } catch (e) {
      console.error(e)
      result.msg = e.message
      result.is_error = true
    }
    return result
  },
}
