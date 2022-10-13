import crypto from 'node:crypto'
import fs from 'node:fs'

function cdnDirCompareFunction(a, b) {
  const a_ = parseInt(a.replace(/\./g, ''))
  const b_ = parseInt(b.replace(/\./g, ''))
  return b_ - a_
}

function sha384(data) {
  const hash = crypto.createHash('sha384')
  hash.update(data)
  return hash.digest('base64')
}

const content = []
const hashes = []
let latest

const cdnDir = fs.readdirSync(`cdn`)
cdnDir.sort(cdnDirCompareFunction)
cdnDir.forEach((file) => {
  const version = file.split('.js')[0]
  if (!latest) {
    latest = version
  }
  content[version] = fs.readFileSync(`cdn/${file}`).toString()
  hashes[version] = sha384(content[version])
})

export default {
  content,
  hashes,
  latest,
}
