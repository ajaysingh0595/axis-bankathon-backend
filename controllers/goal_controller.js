let goal_service = require('../services/goal')
const response_handler = require('../helper/middleware/response_handler')
/*
 * @params
 * response_handler(REQ, OBJECT, MESSAGE, h)
 */

module.exports = {
  create_goal: async function (req, h) {
    let payload = { ...req.payload, user_id: req.auth.credentials.id }
    let response = await goal_service.create_goal(payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  update_goal: async function (req, h) {
    let payload = req.payload
    let id = req.params.id
    let response = await goal_service.update_goal(id, payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  delete_goal: async function (req, h) {
    let id = req.params.id
    let response = await goal_service.delete_goal(id)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  getAllGoal: async function (req, h) {
    let user_id = req.auth.credentials.id
    let response = await goal_service.getAll(req, { user_id })
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
  add_fund_in_goal: async function (req, h) {
    let payload = {
      ...req.payload,
      user_id: req.auth.credentials.id,
      goal_id: req.params.id,
    }
    let response = await goal_service.add_fund_in_goal(payload)
    if (response.is_error) {
      return response_handler.error(req, response.msg, response.result, h)
    }
    return response_handler.success(req, response.result, response.msg, h)
  },
}
