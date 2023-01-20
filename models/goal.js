'use strict'
let o_const = require('../helper/constants/user')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'goal',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
        unique: true,
      },
      amount: {
        type: DataTypes.FLOAT,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: o_const.STATUS.PENDING,
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
