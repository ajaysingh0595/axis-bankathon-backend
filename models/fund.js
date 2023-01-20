'use strict'
let o_const = require('../helper/constants/user')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'fund',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      goal_id: {
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      meta_data: {
        type: DataTypes.JSONB,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      underscored: true,
    }
  )
}
