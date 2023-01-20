const winston = require('winston')
const WinstonCloudWatch = require('winston-cloudwatch')
const aws = require('../aws/aws')
const appConfig = require('../../config/settings')
const aws_cloude_watch = require('./aws_cloude_watch')

const transports = {
  errors: new winston.transports.File({
    filename: `${appConfig.app.logsDir}/errors.log`,
    level: 'error',
  }),
  combined: new winston.transports.File({
    filename: `${appConfig.app.logsDir}/combined.log`,
  }),
  requests: new winston.transports.File({
    filename: `${appConfig.app.logsDir}/requests.log`,
  }),
  console: new winston.transports.Console({
    format: winston.format.prettyPrint(),
  }),
  mail: new winston.transports.File({
    filename: `${appConfig.app.logsDir}/mails.log`,
  }),
}

const loggerTransports = [transports.errors, transports.combined]
const requestTransports = [transports.requests, transports.combined]
const errorTransports = [transports.errors, transports.combined]
const mailTransports = [transports.mail]

const defaultMeta = { service: appConfig.domain, env: process.env.NODE_ENV }

if (process.env.NODE_ENV === 'production') {
  // loggerTransports.push(splunkTransport);
  // errorTransports.push(splunkTransport);
  // requestTransports.push(splunkTransport);
} else if (process.env.NODE_ENV === 'dev') {
  loggerTransports.push(transports.console)
  errorTransports.push(transports.console)
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta,
  transports: loggerTransports,
})

const reqlogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta,
  transports: requestTransports,
})
const cloudwatchlogs = winston.add(
  new WinstonCloudWatch({
    cloudWatchLogs: new aws.CloudWatchLogs(),
    awsRegion: appConfig.AWS.region,
    logGroupName: appConfig.AWS.logging.LOG_GROUP_NAME,
    logStreamName: 'api-request',
    createLogGroup: false,
    createLogStream: false,
    submissionInterval: 1000,
    submissionRetryCount: 1,
    batchSize: 10,
    jsonMessage: true,
  })
)
let requestLogger = async (req, status_code, more_option = {}) => {
  try {
    let create_response_obj = aws_cloude_watch.api_logs(req, status_code)
    if (req.path != '/api/v1/upload/file-upload') {
      if (status_code == 200) {
        // cloudwatchlogs.info(create_response_obj)
      } else {
        // cloudwatchlogs.error(create_response_obj)
      }
    }
  } catch (e) {
    console.error(e)
  }
}

const mailLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta,
  transports: mailTransports,
})

module.exports = {
  logger,
  requestLogger,
  mailLogger,
}
