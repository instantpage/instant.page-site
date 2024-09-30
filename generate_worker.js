#!/usr/bin/env node
import fs from 'node:fs'

import pages from './includes/pages.js'
import versions from './includes/versions.js'
import {pagePath, generatePage, generateWithIncludes, getStylesheet} from './includes/generatePage.js'

function escapeTemplateLiteral(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

let worker = fs.readFileSync('worker_template.js').toString()

worker = worker.replace('__VERSIONS_LATEST__', `\`${versions.latest}\``)

let versionsHashesString = []
for (let version in versions.hashes) {
  const hash = versions.hashes[version]
  versionsHashesString.push(`versions.hashes['${version}'] = \`${hash}\``)
}
versionsHashesString = versionsHashesString.join(`\n`)
worker = worker.replace(`__VERSIONS_HASHES__`, versionsHashesString)

let versionsContentString = []
for (let version in versions.content) {
  const content = versions.content[version]
  versionsContentString.push(`versions.content['${version}'] = \`${escapeTemplateLiteral(content)}\``)
}
versionsContentString = versionsContentString.join(`\n\n`)
worker = worker.replace(`__VERSIONS_CONTENT__`, versionsContentString)



let scriptsString = []
const scriptsDir = fs.readdirSync(`scripts`)
scriptsDir.forEach((file) => {
  const script = fs.readFileSync(`scripts/${file}`).toString()
  scriptsString.push(`scripts['${file}'] = \`${escapeTemplateLiteral(script)}\``)
})
scriptsString = scriptsString.join(`\n\n`)
worker = worker.replace(`__SCRIPTS__`, scriptsString)


const stylesheet = getStylesheet()
worker = worker.replace(`__STYLESHEET__`, `\`${escapeTemplateLiteral(stylesheet)}\``)

let pagesString = []
for (let pageKey in pages) {
  const pageValue = pages[pageKey].replace(/src="\/trusted-by\//g, 'src="https://assets.instant.page/trusted-by/')
  pagesString.push(`pages['${pageKey}'] = \`${escapeTemplateLiteral(pageValue)}\``)
}
pagesString = pagesString.join(`\n\n`)
worker = worker.replace('__PAGES__', pagesString)

const generatePageFunctionsString = [pagePath.toString(), generatePage.toString(), generateWithIncludes.toString()].join('\n\n')
worker = worker.replace('__GENERATE_PAGE__', generatePageFunctionsString)


let configPath
if (fs.existsSync('./config.json')) {
  configPath = './config.json'
}
else {
  configPath = './config.sample.json'
}
const config = fs.readFileSync(configPath, {encoding: 'utf-8'})
worker = worker.replace('__CONFIG__', config)



if (!fs.existsSync('build')) {
  fs.mkdirSync('build')
}

;(function renamePreviousWorkerBuild() {
  const oldPath = 'build/worker.js'

  if (!fs.existsSync(oldPath)) {
    return
  }

  const oldWorker = fs.readFileSync(oldPath).toString()
  if (oldWorker == worker) {
    return
  }

  const {mtime} = fs.statSync(oldPath)
  const isoMtime = mtime.toISOString().replaceAll(/[-:]/g, '').replace(/\.[0-9]{3}Z$/, 'Z')
  const newPath = `build/worker ${isoMtime}.js`
  fs.renameSync(oldPath, newPath)
})()

fs.writeFileSync('build/worker.js', worker)
