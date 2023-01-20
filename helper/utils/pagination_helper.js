/* eslint-disable require-atomic-updates */
var models = require("../../models")

module.exports = {
  paginate_model: async (req, model, query) => {
    let limit = req.query.limit ? req.query.limit : 10
    let count_object = await model.findAndCountAll(query)
    let count = count_object.count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    query["limit"] = limit
    query["offset"] = offset
    query["raw"] = true

    RESPONSE.data = await model.findAll(query)
    return RESPONSE
  },
  paginate_sql: async (req, sql, sequelizeP) => {
    const sequelize = sequelizeP ? sequelizeP : models.sequelize
    let limit = req.query.limit
      ? req.query.limit > 1000
        ? 1000
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.lastIndexOf("FROM")
    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    let count_object = await sequelize
      .query(count_sql, {
        type: sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = parseInt(count_object[0].count)

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {}

    RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: count,
    }

    RESPONSE.data = await sequelize
      .query(
        `
                ${sql}
                LIMIT ${limit} 
                OFFSET ${offset}`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_initial_from: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 100
        ? 100
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_2nd: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 100
        ? 100
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_3rd: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 100
        ? 100
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_4th: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 100
        ? 100
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_5th: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 100
        ? 100
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_6th: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 100
        ? 100
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_7th: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit > 500
        ? 500
        : req.query.limit
      : 10

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  paginate_sql_from_8th: async (req, sql) => {
    let limit = req.query.limit
      ? req.query.limit <= 100
        ? req.query.limit
        : 100
      : 100

    let start_index = sql.indexOf("SELECT")
    let end_index = sql.indexOf("FROM")
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)
    end_index = sql.indexOf("FROM", end_index + 1)

    let count_sql = sql.replace(
      sql.substring(start_index + 6, end_index),
      " count(*) as count "
    )

    // remove order by clause if any
    if (count_sql.toLowerCase().indexOf("order by") !== -1) {
      count_sql = count_sql.substr(
        0,
        count_sql.toLowerCase().indexOf("order by")
      ) // remove order by clause
    }

    req.log("PAGINATE COUNT SQL", count_sql)

    let count_object = await models.sequelize
      .query(count_sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    let count = count_object[0].count

    let page = req.query.page ? req.query.page : 1
    let pages = Math.ceil(count / limit)
    let offset = limit * (page - 1)

    let RESPONSE = {
      limit: limit,
      current_page: page,
      pages: pages,
      count: parseInt(count),
    }

    RESPONSE.data = await models.sequelize
      .query(
        `
            ${sql}
            LIMIT ${limit} 
            OFFSET ${offset}`,
        {
          type: models.sequelize.QueryTypes.SELECT,
        }
      )
      .catch((e) => {
        throw new Error(e)
      })

    return RESPONSE
  },
  get_single_row_by_sql: async (sql, sequelizeP) => {
    const sequelize = sequelizeP ? sequelizeP : models.sequelize
    const row = await sequelize
      .query(sql, {
        type: sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    if (!row) return false
    return row[0]
  },
  get_multi_row_by_sql: async (sql) => {
    const rows = await models.sequelize
      .query(sql, {
        type: models.sequelize.QueryTypes.SELECT,
      })
      .catch((e) => {
        throw new Error(e)
      })
    if (!rows) return []
    return rows
  },
}
