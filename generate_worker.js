const fs = require('fs')

const pages = require('./includes/pages')

function escapeTemplateLiteral(value) {
  return value
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
}

let worker = fs.readFileSync('worker_template.js').toString()



const versions = require('./includes/versions')

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


const stylesheet = fs.readFileSync('styles/stylesheet.css').toString().trim()
worker = worker.replace(`__STYLESHEET__`, `\`${escapeTemplateLiteral(stylesheet)}\``)

let pagesString = []
for (let pageKey in pages) {
  const pageValue = pages[pageKey]
  pagesString.push(`pages['${pageKey}'] = \`${escapeTemplateLiteral(pageValue)}\``)
}
pagesString = pagesString.join(`\n\n`)
worker = worker.replace('__PAGES__', pagesString)

worker = worker.replace('__GENERATE_PAGE__', fs.readFileSync('./includes/generatePage.js').toString().trim())



if (!fs.existsSync('build')) {
  fs.mkdirSync('build')
}
fs.writeFileSync('build/worker.js', worker)
