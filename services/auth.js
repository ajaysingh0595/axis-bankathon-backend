let jwt = require('jsonwebtoken')
let settings = require('../config/settings')
let models = require('../models')
const logger = require('./logger').logger
let crypto = require('crypto')
let send = require('./sms')
let Redis = require('./redis/client')
let ERROR_CODE = require('../helper/constants/error_code')
const Op = require('sequelize').Op
let auth = {
  login: async function (payload) {
    let RESPONSE = {
      is_error: false,
      msg: 'You are successfully logged in',
      result: {},
    }

    try {
      let { username, password } = payload
      let where = {
        [Op.or]: [
          {
            email: username,
          },
          {
            mobile: username,
          },
        ],
        is_deleted: false,
      }
      let user_exist = await models.user.findOne({ where })

      if (!user_exist) {
        RESPONSE.result = ERROR_CODE.USER_NOT_FOUND
        throw new Error(ERROR_CODE.USER_NOT_FOUND.msg)
      }
      if (!user_exist.correctPassword(password)) {
        RESPONSE.result = ERROR_CODE.USER_NOT_FOUND
        throw new Error(ERROR_CODE.USER_NOT_FOUND.msg)
      }
      const jwt_obj = {
        id: user_exist.id,
        uuid: user_exist.uuid,
        email: user_exist.email,
        full_name: user_exist.full_name,
      }
      RESPONSE.result = jwt_obj
      RESPONSE.result.token = await auth.generate_token(jwt_obj)
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  refresh_token: async function (req) {
    let RESPONSE = {
      is_error: false,
      msg: '',
      result: {},
    }
    try {
      let q_where = {
        id: req.auth.credentials.id,
      }
      let query = await models.user.findOne({
        where: q_where,
      })
      if (!query) {
        throw Error('invalid user')
      }
      let redis = new Redis(req.redis)
      if (redis.is_connected) {
        await redis.del(`auth_user_${query.id}`)
      }
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },

  check_redis_jwt_token_is_valid: async (redisClient, jwt_token, user_id) => {
    let isValid = false
    let redis = new Redis(redisClient)
    if (redis.is_connected) {
      let get_redis_token = await redis.get(`auth_user_${user_id}`)
      if (get_redis_token && jwt_token == get_redis_token) {
        isValid = true
      }
    } else {
      isValid = true
    }
    return isValid
  },
  send_otp: async function (mobile) {
    return await send.otp(mobile).catch((err) => {
      throw err
    })
  },
  resend_otp: async function (mobile) {
    return await send.resend_otp(mobile).catch((err) => {
      throw err
    })
  },
  verify_otp: async function (verification_data) {
    return await send.verify_otp(verification_data).catch((e) => {
      throw e
    })
  },
  generate_token: async function (user_data) {
    let dte = user_data
    return jwt.sign(dte, settings.JWT.JWT_KEY, {
      expiresIn: settings.JWT.JWT_TIMEOUT,
    })
  },
  generate_webhook_token: async function (user_data, expiry = '') {
    let dte = user_data
    return jwt.sign(dte, settings.JWT.JWT_WEBHOOK_KEY, {
      expiresIn: expiry ? expiry : settings.JWT.WEBHOOK_TOKEN_EXPIRATION,
    })
  },
  verify_webhook_token: async function (token) {
    return jwt.verify(token, settings.JWT.JWT_WEBHOOK_KEY)
  },
  verify_token: async function (token) {
    return jwt.verify(token, settings.JWT.JWT_KEY)
  },
  verify_global_token: async (token) => {
    return jwt.verify(token, settings.JWT.JWT_KEY)
  },
  genRandomString: function (length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex') /** convert to hexadecimal format */
      .slice(0, length) /** return required number of characters */
  },
  sha512: function (password, salt) {
    let hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
    hash.update(password)
    let value = hash.digest('hex')
    return {
      salt: salt,
      passwordHash: value,
    }
  },
  saltHashPassword: function saltHashPassword(userpassword) {
    let salt = auth.genRandomString(16) /** Gives us salt of length 16 */
    let passwordData = auth.sha512(userpassword, salt)
    return {
      userpassword: userpassword,
      passwordHash: passwordData.passwordHash,
      salt: passwordData.salt,
    }
  },
}

module.exports = auth
