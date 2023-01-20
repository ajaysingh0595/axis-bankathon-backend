let ERROR_CODE = {
  USER_NOT_FOUND: {
    code: 100,
    msg: "username and password is Invalid.",
  },
  DATA_EXITS: {
    USERNAME: {
      code: 200,
      msg: "username is already exits",
    },
    EMAIL: {
      code: 200,
      msg: "email is already exits",
    },
    MOBILE: {
      code: 200,
      msg: "mobile is already exits",
    },
  },
  SERVER_ERROR: {
    code: 701,
    msg: "Something went wrong . please try again later",
  },
}

module.exports = ERROR_CODE
