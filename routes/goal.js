const Joi = require('joi')
const settings = require('../config/settings')
const goal_controller = require('../controllers/goal_controller')
const response_handler = require('../helper/middleware/response_handler')

module.exports = [
  {
    method: 'GET',
    path: settings.API_V1_BASE + '/goal',
    handler: goal_controller.getAllGoal,
    options: {
      description: 'get all goal',
      notes: 'get all goal',
      tags: ['api', 'goal', 'ge-goal'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        query: Joi.object({
          limit: Joi.number().required(),
          page: Joi.number().required(),
        }),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: 'POST',
    path: settings.API_V1_BASE + '/goal',
    handler: goal_controller.create_goal,
    options: {
      description: 'create goal',
      notes: 'create goal',
      tags: ['api', 'goal', 'ge-goal'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          amount: Joi.number().required(),
        }),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: 'PUT',
    path: settings.API_V1_BASE + '/goal/{id}',
    handler: goal_controller.create_goal,
    options: {
      description: 'update goal',
      notes: 'update goal',
      tags: ['api', 'goal'],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        payload: Joi.object({
          title: Joi.string().required(),
          description: Joi.string().required(),
          amount: Joi.number().required(),
        }),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: 'PUT',
    path: settings.API_V1_BASE + '/goal/{id}/delete',
    handler: goal_controller.create_goal,
    options: {
      description: 'delete goal',
      notes: 'delete goal',
      tags: ['api', 'goal'],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
  {
    method: 'POST',
    path: settings.API_V1_BASE + '/goal/{id}/add-fund',
    handler: goal_controller.add_fund_in_goal,
    options: {
      description: 'add fund in goal',
      notes: 'add fund in goal',
      tags: ['api', 'goal'],
      validate: {
        params: Joi.object({
          id: Joi.string().required(),
        }),
        headers: Joi.object({
          authorization: Joi.string().required(),
        }),
        payload: Joi.object({
          amount: Joi.number().required(),
        }),
        failAction: response_handler.badRequest,
        options: {
          allowUnknown: true,
        },
      },
    },
  },
]
