import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'
import routes from './src/routes/crmRoutes'
import rateLimit from 'express-rate-limit'

const app = express()
const PORT = 3000

// helmet setup
app.use(helmet())

// rate limit setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)

// mongoose connection
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/CRMdb')

// bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

routes(app)

// serving static files
app.use(express.static('public'))

app.get('/', (req, res) =>
  res.send(`Node and express server is running on port ${PORT}`)
)

app.listen(PORT, () => console.log(`your server is running on port ${PORT}`))
