const AWS = require("aws-sdk")
const aws_config = require("../../config/settings").AWS

const accessKeyId = aws_config.aws_access_key
const secretAccessKey = aws_config.aws_secret_key
const region = aws_config.region

AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region,
})

module.exports = AWS
