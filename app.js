const http = require('http')
const fs = require('fs')

const versions = require('./includes/versions')

const pages = require('./includes/pages')

const stylesheet = fs.readFileSync('styles/stylesheet.css').toString().trim()

eval(fs.readFileSync('./includes/generatePage.js').toString())

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
    headers['Cache-Control'] = 'max-age=' + (60 * 60 * 24 * 365)
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
  }
  else if (['favicon.ico', 'twitter_summary_image_v2.png'].includes(path)) {
    headers['Content-Type'] = 'image/png'
    content = await fs.promises.readFile(`images/${path}`)
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
