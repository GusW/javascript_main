import { createReadStream } from 'fs'
import { createServer } from 'http'

const file = './powder-day.mp4'

createServer((req, res) => {
  res.writeHeader(200, { 'Content-Type': 'video/mp4' })
  createReadStream(file).pipe(res).on('error', console.error)
}).listen(3000, () => console.log('stream - http://localhost:3000'))
