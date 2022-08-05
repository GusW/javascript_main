import express from 'express'
import crypto from 'crypto'

const app = express()

const doHash = (res) =>
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('Hi there')
  })

app.get('/', (_req, res) => {
  doHash(res)
})

app.get('/fast', (_req, res) => {
  res.send('Fast endpoint')
})

app.listen(3000)
