'use strict'
let o_const = require('../helper/constants/user')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      fcm_token: {
        type: DataTypes.STRING,
      },
      mobile: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // 1 -> Parent, 2 -> Child
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: o_const.STATUS.PENDING,
      },
      password: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue('password')
        },
      },
      salt: {
        type: DataTypes.STRING,
        get() {
          return () => this.getDataValue('salt')
        },
      },
      profile_pic: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.DATEONLY,
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
  const encryptPassword = function (plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }
  const generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
  }

  User.encryptPassword = encryptPassword
  User.generateSalt = generateSalt

  const setSaltAndPassword = (user) => {
    user.uuid = uuidv4()
    if (user.changed('password')) {
      user.salt = User.generateSalt()
      user.password = User.encryptPassword(user.password(), user.salt())
    }
  }
  User.beforeCreate(setSaltAndPassword)
  User.beforeUpdate(setSaltAndPassword)
  User.prototype.correctPassword = function (enteredPassword) {
    return (
      User.encryptPassword(enteredPassword, this.salt()) === this.password()
    )
  }

  return User
}
