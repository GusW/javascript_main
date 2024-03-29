import { createServer } from 'http'
import { stat, createReadStream } from 'fs'
import { promisify } from 'util'

const fileName = '../files/in/powder-day.mp4'
const fileInfo = promisify(stat)

createServer(async (req, res) => {
  const { size } = await fileInfo(fileName)
  const { range } = req.headers
  if (range) {
    let [start, end] = range.replace(/bytes=/, '').split('-')
    start = parseInt(start, 10)
    end = parseInt(end || size - 1, 10)
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4',
    })
    createReadStream(fileName, { start, end }).pipe(res)
  } else {
    res.writeHead(200, {
      'Content-Length': size,
      'Content-Type': 'video/mp4',
    })
    createReadStream(fileName).pipe(res)
  }
}).listen(3000, () => console.log('server running - 3000'))
