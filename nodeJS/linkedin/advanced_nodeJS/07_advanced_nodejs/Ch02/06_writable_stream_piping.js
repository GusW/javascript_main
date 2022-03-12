import { createWriteStream } from 'fs'

const writeStream = createWriteStream('file.txt')

process.stdin.pipe(writeStream)

// cat sample.txt | node 06_writeable_stream_piping
