const express = require('express')

const service = express()

const Speakers = require('./lib/Speakers')

module.exports = (config) => {
  const _routeWrapper = async (
    res,
    next,
    targetFunction,
    functionParams = null
  ) => {
    try {
      const response = functionParams
        ? await targetFunction(functionParams)
        : await targetFunction()
      return res.json(response)
    } catch (error) {
      return next(error)
    }
  }

  const log = config.log()

  const speakers = new Speakers(config.data.speakers)

  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, _res, next) => {
      log.debug(`${req.method}: ${req.url}`)
      return next()
    })
  }

  service.use('/images', express.static(config.data.images))

  service.get(
    '/list',
    async (_req, res, next) => await _routeWrapper(res, next, speakers.getList)
  )

  service.get(
    '/list-short',
    async (_req, res, next) =>
      await _routeWrapper(res, next, speakers.getListShort)
  )

  service.get(
    '/names',
    async (_req, res, next) => await _routeWrapper(res, next, speakers.getNames)
  )

  service.get(
    '/artwork',
    async (_req, res, next) =>
      await _routeWrapper(res, next, speakers.getAllArtwork)
  )

  service.get(
    '/speaker/:shortname',
    async (req, res, next) =>
      await _routeWrapper(res, next, speakers.getSpeaker, req.params.shortname)
  )

  service.get(
    '/artwork/:shortname',
    async (req, res, next) =>
      await _routeWrapper(
        res,
        next,
        speakers.getArtworkForSpeaker,
        req.params.shortname
      )
  )

  service.use((error, _req, res, next) => {
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
