const settings = require("../config/settings")
module.exports = [
  {
    method: "GET",
    path: settings.API_V1_BASE + "/health-check",
    handler: async (req, h) => {
      return h
        .response({
          success: true,
          status_code: 200,
        })
        .code(200)
        .takeover()
    },
    options: {
      auth: false,
      description: "health-check",
      notes: "health-check",
      tags: ["api", "health-check"],
    },
  },
]
