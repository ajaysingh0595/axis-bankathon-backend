const redis = require("redis")
const settings = require("../../config/settings")
let redisClient = redis.createClient({
  host: settings.REDIS_HOST,
  port: settings.REDIS_PORT,
  retry_strategy: function (options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection")
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted")
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

redisClient.on("error", function (error) {
  // console.error(error)
})
redisClient.on("connect", function () {
  console.log("****** redis connection established successfully. ******")
})

module.exports = redisClient
