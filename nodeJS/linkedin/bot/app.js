import createError from 'http-errors'
import helmet from 'helmet'
import express, { json, urlencoded, static as expressStatic } from 'express'
import { join, resolve } from 'path'
import logger from 'morgan'
import ReservationService from './services/ReservationService.js'
import SessionService from './services/SessionService.js'
import WitService from './services/WitService.js'
import indexRouter from './routes/index.js'
import slackRouter from './routes/bots/slack.js'
import alexaRouter from './routes/bots/alexa.js'

export default (config) => {
  const app = express()

  const reservationService = new ReservationService(config.reservations)
  const witService = new WitService(config.wit.token)
  const sessionService = new SessionService()

  const __dirname = resolve()
  // view engine setupcreateError
  app.set('views', join(__dirname, 'views'))
  app.set('view engine', 'ejs')

  app.use(logger('dev'))

  // must be before any generic Node middleware
  app.use(
    '/bots/slack',
    slackRouter({ reservationService, sessionService, witService, config })
  )

  app.use(json())
  app.use(helmet())
  app.use(urlencoded({ extended: false }))
  app.use(expressStatic(join(__dirname, 'public')))

  // Don't create an error if favicon is requested
  app.use((req, res, next) => {
    if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
      return res.sendStatus(204)
    }
    return next()
  })

  app.use(
    '/bots/alexa',
    alexaRouter({ reservationService, sessionService, witService, config })
  )

  app.use('/', indexRouter({ reservationService, config }))

  // catch 404 and forward to error handler
  app.use((_req, _res, next) => {
    next(createError(404))
  })

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  })

  return app
}
