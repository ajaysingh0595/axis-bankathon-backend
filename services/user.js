const logger = require('../services/logger').logger
let models = require('../models')
let ERROR_CODE = require('../helper/constants/error_code')
let service = {
  create_account: async function (payload) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      await service.validate_account(RESPONSE, payload)
      let { id } = await models.user.create(payload)
      // console.log(id)
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  validate_account: async function (RESPONSE, payload) {
    let { email, mobile } = payload

    let email_exits = await models.user.findOne({
      attributes: ['id'],
      where: {
        email,
      },
      raw: true,
    })
    if (email_exits) {
      RESPONSE.result = ERROR_CODE.DATA_EXITS.EMAIL
      throw new Error(ERROR_CODE.DATA_EXITS.EMAIL.msg)
    }
    let mobile_exits = await models.user.findOne({
      attributes: ['id'],
      where: {
        mobile,
      },
      raw: true,
    })
    if (mobile_exits) {
      RESPONSE.result = ERROR_CODE.DATA_EXITS.MOBILE
      throw new Error(ERROR_CODE.DATA_EXITS.MOBILE.msg)
    }
    return true
  },
  user_profile: async function (user_id) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      let find_user = await models.user.findOne({
        attributes: ['id', 'full_name', 'mobile', 'email', 'status'],
        where: { id: user_id, is_deleted: false },
        raw: true,
      })
      if (!find_user) {
        RESPONSE.result = ERROR_CODE.USER_NOT_FOUND
        throw new Error(ERROR_CODE.USER_NOT_FOUND.msg)
      }
      RESPONSE.result = find_user
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
}

module.exports = service
