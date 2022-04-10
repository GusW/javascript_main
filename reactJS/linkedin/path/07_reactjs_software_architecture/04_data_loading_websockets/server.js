import 'isomorphic-fetch'
import express from 'express'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import path from 'path'
import fs from 'fs'
import App from './src/App'
import { InitialDataContext } from './src/InitialDataContext'

global.window = {}

const app = express()

app.use(express.static('./build', { index: false }))

const articles = [
  { title: 'Article 1', author: 'Bob' },
  { title: 'Article 2', author: 'Betty' },
  { title: 'Article 3', author: 'Frank' },
]

const loadedArticles = articles

app.get('/api/articles', (req, res) => {
  res.json(loadedArticles)
})

app.get('/*', async (req, res) => {
  const sheet = new ServerStyleSheet()

  const contextObj = { _isServerSide: true, _requests: [], _data: {} }

  renderToString(
    sheet.collectStyles(
      <InitialDataContext.Provider value={contextObj}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </InitialDataContext.Provider>
    )
  )

  await Promise.all(contextObj._requests)
  contextObj._isServerSide = false
  delete contextObj._requests

  const reactApp = renderToString(
    <InitialDataContext.Provider value={contextObj}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </InitialDataContext.Provider>
  )

  const templateFile = path.resolve('./build/index.html')
  fs.readFile(templateFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err)
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<script>window.preloadedData = ${JSON.stringify(
          contextObj
        )};</script>${sheet.getStyleTags()}<div id="root">${reactApp}</div>`
      )
    )
  })
})

app.listen(8080, () => {
  console.log('Server is listening on port 8080')
})
