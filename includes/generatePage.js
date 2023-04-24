import fs from 'node:fs'
import https from 'node:https'

import versions from './versions.js'
import pages from './pages.js'

let configPath
if (fs.existsSync(new URL('../config.json', import.meta.url))) {
  configPath = '../config.json'
}
else {
  configPath = '../config.sample.json'
}
const config = (await import(configPath, {assert: {type: 'json'}})).default

let githubStars

export function pagePath(path) {
  if (path == '') {
    return 'index'
  }
  return path
}

export function generatePage(path) {
  const pagePath_ = pagePath(path)
  let content = ''

  let header = pages['header']
  let title = pages[`page__${pagePath_}__title`]
  if (title) {
    title = [title, 'instant.page'].join(` ${pages['title-separator']} `)
  }
  else {
    title = 'instant.page'
  }
  header = header.replace('{{TITLE}}', title)
  header = header.replace('{{DESCRIPTION}}', pages[`page__${pagePath_}__description`])
  header = header.replace('{{STYLESHEET}}', getStylesheet())
  header = header.replace('{{TWITTER_CARD}}', path == '' ? pages[`twitter-card-header`] : '')
  const headerTitleTag = path === '' ? 'h1' : 'span'
  header = header.replaceAll(/<(\/?)span-or-h1-if-index>/g, `<$1${headerTitleTag}>`)
  content += header

  content += generateWithIncludes(`page__${pagePath_}__content`)

  let footer = pages['footer']
  footer = footer.toString().replace(new RegExp(`<a class="nav__link" href="/${path}"`), `<a class="nav__link nav__link--active" href="/${path}"`)
  footer = footer.replace(/\{\{VERSIONS_LATEST\}\}/g, versions.latest)
  footer = footer.replace(/\{\{VERSIONS_LATEST_HASH\}\}/g, versions.hashes[versions.latest])
  footer = footer.replace(/\{\{GITHUB_STARS\}\}/, githubStars ? `${githubStars.toLocaleString()} stars` : 'Star')
  content += footer

  return content
}

export function generateWithIncludes(key) {
  let content = pages[key]
  content = content.replace(/\{\{VERSIONS_LATEST\}\}/g, versions.latest)
  content = content.replace(/\{\{VERSIONS_LATEST_HASH\}\}/g, versions.hashes[versions.latest])
  content = content.replace(/<(?:x-)?include>([^<]+)<\/(?:x-)?include>/g, (match, includeKey) => {
    let includeContent = generateWithIncludes(includeKey)
    return includeContent
  })
  return content
}

export function fetchGithubStars() {
  https.get(`https://api.github.com/repos/instantpage/instant.page`, {
    headers: {
      'User-Agent': 'instantpage',
      'Authorization': `Bearer ${config.githubAccessToken}`,
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

  return true
}

function getStylesheet() {
  return fs.readFileSync('styles/stylesheet.css').toString().trim()
}
