import fs from 'node:fs'

const pages = {}

function getContentDir(path) {
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
          pages[`page__${path}__title`] = matches[1]
        }

        const descriptionRegex = /<meta\s+name="description"\s+content="(.*?)">/
        if (matches = descriptionRegex.exec(content)) {
          pages[`page__${path}__description`] = matches[1]
        }

        const bodyStart = content.indexOf('<body>') + '<body>'.length
        pages[`page__${path}__content`] = content.substring(bodyStart).trim()
      }
      else {
        const regex = /<_([^>]+)>(.*?)<\/_[^>]+>/gs
        let matches
        while (matches = regex.exec(content)) {
          const key = matches[1]
          const value = matches[2].trim()
          pages[key] = value
        }
      }
    }
  })
}

getContentDir(`content`)

export default pages
