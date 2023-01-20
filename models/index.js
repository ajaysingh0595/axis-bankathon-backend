/* eslint-disable no-undef */
"use strict"

let fs = require("fs")
let path = require("path")
let Sequelize = require("sequelize")
let config = require("../config/settings")
const db_url = config.database.url
const db_settings = config.database.settings
let sequelize = new Sequelize(db_url, db_settings)
let db = {}

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection has been established successfully.",
      process.env.NODE_ENV
    )
  })
  .catch((err) => {
    console.error(err)
  })

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file !== "index.js"
  })
  .forEach(function (file) {
    var model = require(path.join(__dirname, file))(sequelize, Sequelize)
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db)
  }
})

// Sequelize.prototype.close = ()=>{

//   sequelize.connectionManager.pool.destroyAllNow();

// }
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
