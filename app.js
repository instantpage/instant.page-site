const http = require('http')
const https = require('https')
const fs = require('fs')

const versions = require('./includes/versions')

const pages = require('./includes/pages')

const assets = require('./includes/assets')

const stylesheet = fs.readFileSync('styles/stylesheet.css').toString().trim()

eval(fs.readFileSync('./includes/generatePage.js').toString())

const config = require(fs.existsSync('./config.js') ? './config.js' : './config.sample.js')

let githubStars

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

    if (!githubStars) {
      https.get(`https://api.github.com/repos/instantpage/instant.page`, {
        headers: {
          'User-Agent': 'instantpage',
          'Authorization': `token ${config.githubAccessToken}`,
        }
      }, (res) => {
        let data = ''
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          githubStars = JSON.parse(data).stargazers_count
        })
      })
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
  http.createServer(requestListener).listen(8000)
})()
