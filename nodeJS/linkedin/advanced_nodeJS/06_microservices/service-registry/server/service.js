const express = require('express')
const ServiceRegistry = require('./lib/ServiceRegistry')

const service = express()

module.exports = (config) => {
  const log = config.log()
  const serviceRegistry = new ServiceRegistry(log)
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, _res, next) => {
      log.debug(`${req.method}: ${req.url}`)
      return next()
    })
  }

  const _getServiceIp = (req) => req.socket.remoteAddress.replace(/^.*:/, '')

  service.put(
    '/register/:servicename/:serviceversion/:serviceport',
    (req, res) => {
      const { servicename, serviceversion, serviceport } = req.params

      const serviceip = _getServiceIp(req)
      const serviceKey = serviceRegistry.register(
        servicename,
        serviceversion,
        serviceip,
        serviceport
      )
      return res.json({ result: serviceKey })
    }
  )

  service.delete(
    '/register/:servicename/:serviceversion/:serviceport',
    (req, res) => {
      const { servicename, serviceversion, serviceport } = req.params
      const serviceip = _getServiceIp(req)
      const serviceKey = serviceRegistry.unregister(
        servicename,
        serviceversion,
        serviceip,
        serviceport
      )
      return res.json({ result: serviceKey })
    }
  )

  service.get('/find/:servicename/:serviceversion', (req, res, next) => {
    const { servicename, serviceversion } = req.params
    const service = serviceRegistry.get(servicename, serviceversion)
    if (!service) return res.status(404).json({ result: 'Service not found' })
    return res.json({ result: service })
  })

  // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500)
    // Log out the error to the console
    log.error(error)
    return res.json({
      error: {
        message: error.message,
      },
    })
  })
  return service
}
