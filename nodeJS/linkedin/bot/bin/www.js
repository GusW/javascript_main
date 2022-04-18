#!/usr/bin / env node

/* eslint-disable no-use-before-define */

/**
 * Module dependencies.
 */
import { createServer } from 'http'
import debugPkg from 'debug'
import appPkg from '../app.js'
import { reservations, slack, wit } from '../config/index.js'

const debug = debugPkg('reservation:server')

const app = appPkg({ reservations, slack, wit })

// Handle any uncaught exceptions
process.on('uncaughtException', (err) => {
  debug(' UNCAUGHT EXCEPTION ')
  debug(`[Inside 'uncaughtException' event] ${err.stack}` || err.message)
})

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const parsedPort = parseInt(val, 10)

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedPort)) {
    // named pipe
    return val
  }

  if (parsedPort >= 0) {
    // port number
    return parsedPort
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debug(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      debug(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  debug(`Listening on ${bind}`)
}
