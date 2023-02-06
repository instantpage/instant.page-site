import http from 'node:http'
import fs from 'node:fs'

import versions from './includes/versions.js'
import pages from './includes/pages.js'
import assets from './includes/assets.js'
import {pagePath, generatePage, fetchGithubStars} from './includes/generatePage.js'

let configPath
if (fs.existsSync('./config.json')) {
  configPath = './config.json'
}
else {
  configPath = './config.sample.json'
}
const config = await import(configPath, {assert: {type: 'json'}})

let githubStarsFetched

const assetMimeTypes = {
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'jpg': 'image/jpeg',
  'gif': 'image/gif',
  'ico': 'image/png', // We serve the favicon as a PNG
}

async function requestListener(req, res) {
  const path = req.url.split('?')[0].substr(1)

  let status = 200
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
  }
  let content = ''

  if (path in versions.content) {
    headers['Content-Type'] = 'text/javascript'
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Cache-Control'] = 'max-age=' + (60 * 60 * 24 * 30)
    content = versions.content[path]
  }
  else if (/^[a-zA-Z0-9\-_]+\.js$/.test(path) && fs.existsSync(`scripts/${path}`)) {
    headers['Content-Type'] = 'text/javascript'
    //headers['Cache-Control'] = 'max-age=60'
    content = await fs.promises.readFile(`scripts/${path}`)
  }
  else if (`page__${pagePath(path)}__content` in pages) {
    //headers['Cache-Control'] = 'max-age=5'
    content = generatePage(path)

    if (!githubStarsFetched) {
      githubStarsFetched = fetchGithubStars()
    }
  }
  else if (['favicon.ico', 'twitter_summary_image_v2.png'].includes(path)) {
    headers['Content-Type'] = 'image/png'
    content = await fs.promises.readFile(`images/${path}`)
  }
  else if (/\.(png|svg|jpg|gif|ico)$/.test(path)) {
    const extension = path.substr(path.lastIndexOf('.') + 1)
    headers['Content-Type'] = assetMimeTypes[extension]
    content = await fs.promises.readFile(`assets/${path}`)
  }
  else {
    status = 404
    content = `404 page not found<br><a href="/">home page</a>`
  }

  res.writeHead(status, headers)
  res.write(content)
  res.end()
}

;(async () => {
  const server = http.createServer(requestListener)
  const port = 8000
  server.on('listening', () => {
    console.log(`-> http://127.0.0.1:${port}/`)
  })
  server.listen(port)
})()
