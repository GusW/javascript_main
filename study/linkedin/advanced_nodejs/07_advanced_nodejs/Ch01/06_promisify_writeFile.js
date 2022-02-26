import { writeFile as _writeFile } from 'fs'
import { promisify } from 'util'

const writeFile = promisify(_writeFile)

writeFile('sample.txt', 'This is a sample')
  .then(() => console.log('file successfully created'))
  .catch((error) => console.log(`error creating file: ${error}`))
