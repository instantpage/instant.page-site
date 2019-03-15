function pagePath(path) {
  if (path == '') {
    return 'index'
  }
  return path
}

function generatePage(path) {
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
  header = header.replace('{{STYLESHEET}}', stylesheet)
  header = header.replace('{{TWITTER_CARD}}', path == '' ? pages[`twitter-card-header`] : '')
  content += header

  content += generateWithIncludes(`page__${pagePath_}__content`)

  let footer = pages['footer']
  footer = footer.toString().replace(new RegExp(`<a class="nav__link" href="/${path}"`), `<a class="nav__link nav__link--active" href="/${path}"`)
  footer = footer.replace(/\{\{VERSIONS_LATEST\}\}/g, versions.latest)
  footer = footer.replace(/\{\{VERSIONS_LATEST_HASH\}\}/g, versions.hashes[versions.latest])
  content += footer

  return content
}

function generateWithIncludes(key) {
  let content = pages[key]
  content = content.replace(/\{\{VERSIONS_LATEST\}\}/g, versions.latest)
  content = content.replace(/\{\{VERSIONS_LATEST_HASH\}\}/g, versions.hashes[versions.latest])
  content = content.replace(/<include>([^<]+)<\/include>/g, (match, includeKey) => {
    let includeContent = generateWithIncludes(includeKey)
    return includeContent
  })
  return content
}
