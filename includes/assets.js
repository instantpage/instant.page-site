import fs from 'node:fs'
import crypto from 'node:crypto'

const assets = {}

function getHash(data) {
  const hash = crypto.createHash('sha384')
  hash.update(data)
  return hash.digest('hex').substr(0, 8)
}

function getContentDir(path) {
  const contentDir = fs.readdirSync(path)
  contentDir.forEach((file) => {
    if (fs.lstatSync(`${path}/${file}`).isDirectory()) {
      getContentDir(`${path}/${file}`)
    }
    else {
      const content = fs.readFileSync(`${path}/${file}`).toString()
      const key = `${path}/${file}`.substr('assets/'.length)
      const value = getHash(content)
      assets[key] = value
    }
  })
}

getContentDir(`assets`)

export default assets
