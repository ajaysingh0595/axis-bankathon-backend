/* eslint-disable no-unused-vars */
var models = require('../models')

/**
 * Sync(create) a table using the table structure
 * present in the ../models/{file}
 */

// Insert

models.sequelize
  .sync({
    force: true,
    logging: console.log,
  })
  .then(
    () => {
      console.log('Sync Complete...')
      //req.log(`${model} model synced`);
    },
    (err) => {
      console.error(err)
    }
  )
