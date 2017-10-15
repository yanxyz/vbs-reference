const path = require('path')
const { URL } = require('url')
const got = require('got')
const pMap = require('p-map')
const config = require('../config')
const { getId, writeFile, debug } = require('../utils')
const render = require('./render')

let siteConfig

module.exports = function (arg) {
  // 获取 site 全部页面
  const sites = Object.keys(config.sites)
  if (sites.includes(arg)) {
    siteConfig = config.sites[arg]
    return fetchAll()
  }

  // url, 获取单页
  if (arg.startsWith('https://')) {
    const name = new URL(arg).hostname.replace('.microsoft.com', '')
    debug(name)
    if (!sites.includes(name)) {
      console.log('This url is not supported.')
      return
    }
    siteConfig = config.sites[name]

    return fetch({
      href: arg,
      id: getId(arg)
    })
  }

  // id, 获取单页
  if (arg.length === 8) {
    siteConfig = config.sites['msdn']
    return fetch({
      href: `https://msdn.microsoft.com/en-us/library/${arg}(v=vs.84).aspx`,
      id: arg
    })
  }

  console.warn('Unknown argument')
}


function fetchAll() {
  const jsonFile = siteConfig.files.json

  let files
  try {
    files = require(jsonFile)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Cannot find file '${jsonFile}'.`)
      console.error(`Run the command 'toc ${name}' to get it.`)
      return
    }
    throw err
  }

  pMap(files, fetch, { concurrency: 5 })
}

async function fetch(page) {
  const { href } = page

  let html
  try {
    html = got(href, { timeout: 5000 }).then(res => res.body)
  } catch (err) {
    console.error(`Failed to fetch page ${href}`)
    return
  }

  let content
  try {
    const starting = '<div id="content" '
    const ending = '<div class="libraryMemberFilter">'
    const re = new RegExp(starting + '[\\s\\S]+' + ending)
    const match = html.match(re)
    content = match[0].slice(0, -ending.length) + '</div>'
  } catch (err) {
    // https://technet.microsoft.com/en-us/library/ee692932.aspx
    content = retry(html)
    if (!content) {
      console.log(`Cannot get content ${href}`)
      return
    }
  }

  let title
  if (page.title) {
    title = page.title
  } else {
    try {
      title = html.match('<title>(.+?)</title>')[1]
    } catch (err) {
      console.log(`Cannot get title ${href}`)
      return
    }
  }

  await writeFile(path.join(siteConfig.root, page.id + '.html'),
    render({ content, href, title }))
}

function retry(html) {
  try {
    const starting = '<div id="content" '
    const ending = '<div id="rightNavigationMenu"' // 范围更大
    const re = new RegExp(starting + '[\\s\\S]+' + ending)
    const match = html.match(re)
    return match[0].slice(0, -ending.length)
  } catch (err) {
    return null
  }
}
