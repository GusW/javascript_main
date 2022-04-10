import express from 'express'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import path from 'path'
import fs from 'fs'
import App from './src/App'

const app = express()

app.use(express.static('./build', { index: false }))

app.get('/*', (req, res) => {
  const getReactApp = (sheet) =>
    renderToString(
      sheet.collectStyles(
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      )
    )

  const templateFile = path.resolve('./build/index.html')
  fs.readFile(templateFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err)
    }

    const sheet = new ServerStyleSheet()
    try {
      const html = data.replace(
        '<div id="root"></div>',
        `<div id="root">${getReactApp()}</div>`
      )
      const styleTags = sheet.getStyleTags()
      return res.send(html.replace('{{ styles }}', styleTags))
    } catch (error) {
      return res.status(500).send(error)
    } finally {
      sheet.seal()
    }
  })
})

app.listen(8080, () => {
  console.log('Server is listening on port 8080')
})
