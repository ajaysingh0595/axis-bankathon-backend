const logger = require('./logger').logger
let models = require('../models')
let ERROR_CODE = require('../helper/constants/error_code')
let pagination_helper = require('../helper/utils/pagination_helper')
let service = {
  getAll: async function (req, filter) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      const sql = `SELECT 
      goal.*,
      (goal.amount- achieved_amount) as pending_amount
      FROM (
        select
        g.*,
      (
      select sum(amount) from funds where goal_id=g.id) as achieved_amount	 
      from goals as g where g.user_id=${filter?.user_id}
      ) as goal
      `

      RESPONSE.result = await pagination_helper.get_multi_row_by_sql(sql)
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  create_goal: async function (payload) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      let { id } = await models.goal.create(payload)
      // console.log(id)
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  update_goal: async function (id, payload) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      let isFound = await models.goal.findOne({
        where: {
          id,
        },
      })
      if (!isFound) {
        throw Error('id does not exits')
      }
      await isFound.update(payload)
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  delete_goal: async function (id) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      let isFound = await models.goal.findOne({
        where: {
          id,
        },
      })
      if (!isFound) {
        throw Error('id does not exits')
      }
      await models.goal.destroy({
        where: {
          id,
        },
      })
    } catch (e) {
      console.error(e)
      logger.error(e)
      RESPONSE.is_error = true
      RESPONSE.msg = e.message
    }
    return RESPONSE
  },
  add_fund_in_goal: async function (payload) {
    let RESPONSE = {
      is_error: false,
      msg: 'Ok',
      result: {},
    }
    try {
      let isFound = await models.goal.findOne({
        where: {
          id: payload.goal_id,
        },
      })
      if (!isFound) {
        throw Error('goal_id does not exits')
      }
      await models.fund.create(payload)
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
