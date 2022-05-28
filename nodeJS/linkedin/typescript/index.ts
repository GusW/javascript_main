import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import routes from './src/routes/crmRoutes'

dotenv.config()

const _createApp = (client) => {
  const app = express()
  const PORT = process.env.PORT

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
}

MongoClient.connect(process.env.LINKEDIN_TYPESCRIPT_DB_URI, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })
  .then(async (client) => {
    _createApp(client)
  })

// // mongoose connection
// mongoose.Promise = global.Promise
// mongoose.connect(
//   'mongodb+srv://gusw:dqgtH4RLaNyCnjz@cluster0.eywge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
//   {
//     useMongoClient: true,
//   }
// )
