import { readdir as _readdir } from 'fs'
import { promisify } from 'util'
import { performance } from 'perf_hooks'
import path from 'path'

const readdir = promisify(_readdir)

const __dirname = path.resolve()

const delay = (seconds) =>
  new Promise((resolves) => {
    setTimeout(resolves, seconds * 1000)
  })

// returns after first done
const race = performance.now()
Promise.race([delay(5), delay(2), delay(3), delay(5)])
  .then(() => console.log(`race: ${performance.now() - race}`))
  .then(() => readdir(__dirname))
  .then(console.log)

// returns after all done
const all = performance.now()
Promise.all([delay(5), delay(2), delay(3), delay(5)])
  .then(() => console.log(`all: ${performance.now() - all}`))
  .then(() => readdir(__dirname))
  .then(console.log)
