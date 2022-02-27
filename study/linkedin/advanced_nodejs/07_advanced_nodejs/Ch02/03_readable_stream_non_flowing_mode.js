import { createReadStream } from 'fs'

const readStream = createReadStream('../files/in/powder-day.mp4')

readStream.on('data', (chunk) => {
  console.log('size: ', chunk.length)
})

readStream.on('end', () => {
  console.log('read stream finished')
})

readStream.on('error', (error) => {
  console.log('an error has occured.')
  console.error(error)
})

// transform flowing into non-flowing
readStream.pause()
process.stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'finish') {
    // transform non-flowing into flowing
    readStream.resume()
  }
  readStream.read()
})
