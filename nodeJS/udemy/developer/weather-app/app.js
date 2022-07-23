import request from 'request'
import dotenv from 'dotenv'

dotenv.config()

const url = `http://api.weatherstack.com/current?access_key=${process.env.HASH}&query=42.3605,-71.0596`

request({ url, json: true }, (error, response) => {
  const { temperature, feelslike } = response.body.current
  console.info(
    `It is currently ${temperature} degrees out. It feels like ${feelslike}`
  )
})
