import {
  writeFile as _writeFile,
  unlink as _unlink,
  readdir as _readdir,
} from 'fs'
import { promisify } from 'util'
var writeFile = promisify(_writeFile)
var unlink = promisify(_unlink)
var readdir = promisify(_readdir)
var beep = () => process.stdout.write('\x07')
var delay = (seconds) =>
  new Promise((resolves) => {
    setTimeout(resolves, seconds * 1000)
  })

async function start() {
  var files = await readdir(__dirname)
  console.log(files)
}

start()
