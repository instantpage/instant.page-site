import fs from 'node:fs'

const pagesProxyTarget = {}
let lastFetch = -50
const pagesProxy = new Proxy(
  pagesProxyTarget,
  {
    get(target, property, receiver) {
      if (performance.now() - lastFetch >= 50) {
        getContentDir(`content`)
      }
      return Reflect.get(...arguments)
    }
  }
)

function getContentDir(path) {
  lastFetch = performance.now()
  const contentDir = fs.readdirSync(path)
  contentDir.forEach((file) => {
    if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
      getContentDir(`${path}/${file}`)
    }
    else {
      const content = fs.readFileSync(`${path}/${file}`).toString()

      if (content.startsWith('<!')) {
        const path = file.substring(0, file.lastIndexOf('.'))
        let matches

        const titleRegex = /<title>(.*?)<\/title>/
        if (matches = titleRegex.exec(content)) {
          pagesProxyTarget[`page__${path}__title`] = matches[1]
        }

        const descriptionRegex = /<meta\s+name="description"\s+content="(.*?)">/
        if (matches = descriptionRegex.exec(content)) {
          pagesProxyTarget[`page__${path}__description`] = matches[1]
        }

        const bodyStart = content.indexOf('<body>') + '<body>'.length
        pagesProxyTarget[`page__${path}__content`] = content.substring(bodyStart).trim()
      }
      else {
        const regex = /<_([^>]+)>(.*?)<\/_[^>]+>/gs
        let matches
        while (matches = regex.exec(content)) {
          const key = matches[1]
          const value = matches[2].trim()
          pagesProxyTarget[key] = value
        }
      }
    }
  })
}

getContentDir(`content`)

export default pagesProxy
