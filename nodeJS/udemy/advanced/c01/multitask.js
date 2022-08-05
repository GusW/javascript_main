import { performance } from 'perf_hooks'
import crypto from 'crypto'
import https from 'https'
import fs from 'fs'
import path from 'path'

const start = performance.now()
const BASE_DIR = path.resolve()

const doHash = (id) =>
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    console.log(`Hash ${id}:`, performance.now() - start)
  })

const doRequest = () =>
  https
    .request('https://www.google.com', (res) => {
      res.on('data', () => {})
      res.on('end', () => {
        console.log('Request:', performance.now() - start)
      })
    })
    .end()

doRequest()

fs.readFile(path.join(BASE_DIR, 'multitask.js'), 'utf8', () => {
  console.log('FS:', performance.now() - start)
})

doHash(1)
doHash(2)
doHash(3)
doHash(4)
