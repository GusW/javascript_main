import express from 'express'
import { Worker } from 'worker_threads'

const app = express()

app.get('/', (_req, res) => {
  const worker = new Worker('./worker.js')

  worker.on('message', (message) => {
    console.log(message)
    res.send('' + message)
  })

  worker.postMessage('start!')
})

app.get('/fast', (_req, res) => {
  res.send('Fast endpoint')
})

app.listen(3000)
