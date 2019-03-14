const fs = require('fs')

const pages = {}

function getContentDir(path) {
  const contentDir = fs.readdirSync(path)
  contentDir.forEach((file) => {
    if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
      getContentDir(`${path}/${file}`)
    }
    else {
      const content = fs.readFileSync(`${path}/${file}`).toString()
      const regex = /<_([^>]+)>(.*?)<\/_[^>]+>/gs
      let matches
      while (matches = regex.exec(content)) {
        const key = matches[1]
        const value = matches[2].trim()
        pages[key] = value
      }
    }
  })
}

getContentDir(`content`)

module.exports = pages
