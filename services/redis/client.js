const logger = require("../logger").logger
class Redis {
  is_connected = false
  constructor(client) {
    this.client = client
    this.is_connected = client.connected
  }
  async get(key) {
    return new Promise((resolve, reject) => {
      let wait = setTimeout(() => {
        clearTimeout(wait)
        reject(new Error(`Cache Timeout`))
      }, 2000)

      this.client.get(key, (err, result) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  }
  async set(key, value, ttl = null) {
    logger.info("CACHE_SET", key, value)
    return new Promise((resolve, reject) => {
      console.info("CACHE_SET", key, value)

      if (ttl) {
        this.client.set(key, value, "EX", ttl, (err, d) => {
          if (err) {
            console.error("CACHE_SET_ERROR", err)
            reject(err)
          }
          this.client.expire(key, ttl)
          console.info("CACHE_SET_SUCCESS", d)
          resolve(d)
        })
      } else {
        this.client.set(key, value, (err, d) => {
          if (err) {
            console.error("CACHE_SET_ERROR", err)
            reject(err)
          }
          console.info("CACHE_SET_SUCCESS", d)
          resolve(d)
        })
      }
    })
  }
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) reject(err)
        resolve(reply)
      })
    })
  }
  async incr(key) {
    return new Promise((resolve, reject) => {
      this.client.incr(key, (err, d) => {
        if (err) reject(err)
        resolve(d)
      })
    })
  }
  async mget(keys) {
    return await new Promise((resolve, reject) => {
      this.client.mget(keys, (err, result) => {
        if (err) {
          logger.error(err)
          reject(new Error(err))
        } else {
          logger.info("CACHE_GET", keys, result)
          resolve(result)
        }
      })
    })
  }
  async keys(pattern) {
    logger.info("*******************", this.client.keys)
    return await new Promise((resolve, reject) => {
      this.client.keys(pattern, (err, result) => {
        if (err) {
          logger.error(err)
          reject(new Error(err))
        } else {
          logger.info("CACHE_GET", result)
          resolve(result)
        }
      })
    })
  }
  async topic_publisher(topic, meta_data) {
    logger.info("******************* publish topic", topic)
    return await new Promise((resolve, reject) => {
      this.client.publish(topic, JSON.stringify(meta_data), (err, result) => {
        if (err) {
          logger.error(err)
          reject(new Error(err))
        } else {
          logger.info("CACHE_GET", result)
          resolve(result)
        }
      })
    })
  }
}

module.exports = Redis
