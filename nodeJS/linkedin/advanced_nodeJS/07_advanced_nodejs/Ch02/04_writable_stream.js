import { createReadStream, createWriteStream } from 'fs'

const readStream = createReadStream('../files/in/powder-day.mp4')
const writeStream = createWriteStream('../files/out/copy.mp4')

readStream.on('data', (chunk) => {
  writeStream.write(chunk)
})

readStream.on('error', (error) => {
  console.log('an error occurred', error.message)
})

readStream.on('end', () => {
  writeStream.end()
})

writeStream.on('close', () => {
  process.stdout.write('file copied\n')
})
