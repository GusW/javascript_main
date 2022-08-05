import express from 'express'
import { performance } from 'perf_hooks'
import cluster from 'cluster'
import { cpus } from 'os'
import crypto from 'crypto'

// emulating only 1 thread on the threadpool
// used to benchmarking purposes
process.env.UV_THREADPOOL_SIZE = 1

// first call will be always to Primary
if (cluster.isPrimary) {
  // create Workers
  const cpuCount = cpus().length - 1
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }
} else {
  const app = express()

  const doWork = (duration) => {
    const start = performance.now()
    while (performance.now() - start < duration) {}
  }

  const doHash = (res) =>
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
      res.send('Hi there')
    })

  app.get('/', (_req, res) => {
    // blocking
    /*
    doWork(5000)
    res.send('Hi there')
    **/
    doHash(res)
  })

  app.get('/fast', (_req, res) => {
    res.send('Fast endpoint')
  })

  app.listen(3000)
}
