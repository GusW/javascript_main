import request from 'request'
import dotenv from 'dotenv'

dotenv.config()

const WEATHER_STACK = process.env.WEATHER_STACK

let url = `http://api.weatherstack.com/current?access_key=${WEATHER_STACK}&query=42.3605,-71.0596`

request({ url, json: true }, (_error, response) => {
  console.log(
    response.body.current.weather_descriptions[0] +
      '. It is currently ' +
      response.body.current.temperature +
      ' degress out.'
  )
})

const MAPBOX =
  'pk.eyJ1IjoiYW5kcmV3bWVhZDEiLCJhIjoiY2pvOG8ybW90MDFhazNxcnJ4OTYydzJlOSJ9.njY7HvaalLEVhEOIghPTlw'

const geocodeURL =
  'https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=&limit=1'

request({ url: geocodeURL, json: true }, (error, response) => {
  const latitude = response.body.features[0].center[0]
  const longitude = response.body.features[0].center[1]
  console.log(latitude, longitude)
})
