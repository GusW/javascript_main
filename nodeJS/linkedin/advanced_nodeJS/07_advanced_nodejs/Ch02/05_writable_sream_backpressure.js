import { createReadStream, createWriteStream } from 'fs'

const readStream = createReadStream('../files/in/powder-day.mp4')
const writeStream = createWriteStream('../files/out/copy.mp4', {
  // stream "hose" capacity
  // highWaterMark: 1628920128
})

readStream.on('data', (chunk) => {
  const result = writeStream.write(chunk)
  if (!result) {
    // stream "hose" is full
    console.log('backpressure')
    readStream.pause()
  }
})

readStream.on('error', (error) => {
  console.log('an error occurred', error.message)
})

readStream.on('end', () => {
  writeStream.end()
})

writeStream.on('drain', () => {
  // stream "hose" has some bandwidth again
  console.log('drained')
  readStream.resume()
})

writeStream.on('close', () => {
  process.stdout.write('file copied\n')
})
