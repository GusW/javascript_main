import { readFile } from 'fs'
import { createServer } from 'http'

const file = './powder-day.mp4'

createServer((req, res) => {
  readFile(file, (error, data) => {
    if (error) {
      console.log('hmmmm: ', error)
    }
    res.writeHeader(200, { 'Content-Type': 'video/mp4' })
    res.end(data)
  })
}).listen(3000, () => console.log('buffer - http://localhost:3000'))
