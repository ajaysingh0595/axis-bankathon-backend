'use strict'
const Hapi = require('@hapi/hapi')
const settings = require('./config/settings')
const routes = require('./routes')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const Pack = require('./package')
const redisClient = require('./services/redis')
const Path = require('path')
let moment = require('moment')

const app = {
  templatePath: '.',
}

const server = new Hapi.Server({
  host: settings.host,
  port: settings.port,
  routes: {
    cors: {
      origin: ['*'], // an array of origins or 'ignore'
      credentials: true, // boolean - 'Access-Control-Allow-Credentials'
    },
    files: {
      relativeTo: Path.join(__dirname, 'static'),
    },
  },
})

const swaggerOptions = {
  info: {
    title: 'Bankathon API Documentation',
    version: Pack.version,
  },
  // basePath: settings.SWAGGER.basePath,
  // documentationPath: settings.SWAGGER.documentationPath,
}

const validate = async function (decoded, request, h) {
  console.log(
    'authorization',
    JSON.stringify(decoded),
    request.headers['authorization']
  )
  // do your checks to see if the person is valid
  return { isValid: true }
}
server.register(require('./lib'))
server.auth.strategy('jwt', 'jwt', {
  key: settings.JWT.JWT_KEY, // Never Share your secret key
  validate, // validate function defined above,
})
server.auth.default('jwt')

server.route(routes)

server.ext('onRequest', async (req, h) => {
  req.log = (...args) => {
    console.log(...args)
  }

  req['redis'] = redisClient

  // Setting Initial Start time of execution of the API
  req['x-request-start'] = new Date().getTime()
  return h.continue
})

server.ext('onPreResponse', async (req, h) => {
  // Calculating API Response
  const start = parseInt(req['x-request-start'])
  const end = new Date().getTime()
  if (!req.response.isBoom) {
    req['x-execution-time'] = end - start
  }
  let payload = req.path == '/api/v1/upload/file-upload' ? {} : req.payload
  console.log(
    moment().format('DD-MM-YYYY hh:mm:ss'),
    req.method.toUpperCase(),
    req.path,
    `${req['x-execution-time']} ms`,
    JSON.stringify(payload)
  )

  return h.continue
})

server.events.on('log', (event, tags) => {
  console.log(event, tags)
})

app.main = async () => {
  console.log('server start')
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ])

  await server.register(require('@hapi/inert'))
  await server.start()
  console.log('Server is running at ' + server.info.uri)
  process.setMaxListeners(0)
}

app.main()

module.exports = server
