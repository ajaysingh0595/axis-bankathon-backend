/* eslint-disable no-undef */
require('dotenv').config()

let CONFIG = {
  MODE: process.env.NODE_ENV,
  app: {
    logsDir: './logs',
  },
  login: {
    FLOW_ID: process.env.KALEYRA_FLOW_ID,
    OTP_API: process.env.KALEYRA_API_KEY,
  },
  timezone: {
    india: 'Asia/Kolkata',
  },
  API_V1_BASE: '/api/v1',
  SWAGGER: {
    basePath: '/api',
    documentationPath: '/api/doc',
  },
  APP_SETTINGS: {
    buildNumber: '1',
    forceUpdate: true,
  },
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  host: '0.0.0.0',
  port: process.env.SERVER_PORT,
  cors: true,
  database: {
    url:
      process.env.NODE_ENV == 'dev'
        ? process.env.DEV_DB_URL
        : process.env.PROD_DB_URL,
    settings: {
      pool: {
        min: 2,
        max: 30,
        idle: 5000,
        acquire: 2 * 60 * 1000,
        //evict: 60000,
        autostart: true,
        handleDisconnects: true,
      },
      // retry_on_reconnect: {
      //   transactions: true,
      // },
      logging: false,
      //operatorsAliases: false
    },
  },
  JWT: {
    JWT_KEY:
      process.env.NODE_ENV == 'dev'
        ? process.env.JWT_DEV_KEY
        : process.env.JWT_PROD_KEY,
    JWT_TIMEOUT: process.env.TOKEN_EXPIRATION,
    JWT_WEBHOOK_KEY:
      process.env.NODE_ENV == 'dev'
        ? process.env.JWT_WEBHOOK_DEV_KEY
        : process.env.JWT_WEBHOOK_PROD_KEY,
    WEBHOOK_TOKEN_EXPIRATION: process.env.WEBHOOK_TOKEN_EXPIRATION,
  },
  AWS: {
    logging: {
      LOG_GROUP_NAME:
        process.env.NODE_ENV == 'dev' ? 'api-service-dev' : 'api-service-prod',
      LogGroup_PATH:
        process.env.NODE_ENV == 'dev'
          ? '/aws/ec2/ap-south-1/api-service-dev'
          : '/aws/ec2/ap-south-1/api-service-prod',
    },
    CDN_URL: '',
    aws_access_key: process.env.AWS_ACCESS_KEY,
    aws_secret_key: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    s3: {
      access_key: process.env.AWS_ACCESS_KEY,
      access_secret: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    },
    // For Emails
    ses: {
      access_key: process.env.AWS_ACCESS_KEY,
      access_secret: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      from_email: 'no-reply@my.in',
    },
  },
}

module.exports = CONFIG
