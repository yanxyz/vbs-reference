/**
 * 修改已下载的页面，主要用于修改页面模板的情况，避免重新下载
 */

const fs = require('fs')
const path = require('path')
const config = require('../config')
const render = require('./render')

module.exports = function (arg) {
  // 指定 site/x.html, 修改单个页面
  if (arg.endsWidth('.html')) {
    modifySingle(arg)
    return
  }

  // 修改全部页面
  if (arg === 'all') {
    modifyAll()
    return
  }

  console.error('Unknow argument')
}

function modifySingle(arg) {
  const [site, name] = arg.split('/')
  const siteConfig = config.sites[site]
  const filename = path.join(siteConfig.root, name)
  // 从 files.json 查找数据
  const files = require(siteConfig.files.json)
  const id = name.replace('.html', '')
  const data = files.find(x => x.id === id)
  modify(filename, data)
}

function modifyAll() {
  for (const siteConfig of Object.values(config.sites)) {
    const files = require(siteConfig.files.json)
    files.forEach(x => {
      const filename = path.join(siteConfig.root, x.id + '.html')
      modify(filename, x)
    })
  }
}

function modify(filename, data) {
  const html = fs.readFileSync(filename, 'utf8')

  // 提取正文
  let content
  try {
    const starting = '<div id="content" '
    const ending = '</div>'
    const re = new RegExp(starting + '[\\s\\S]+' + ending)
    const match = html.match(re)
    content = match[0]
  } catch (err) {
    console.error(`Cannot get content ${filename}`)
  }

  // 这里可以进一步修改 content

  // 保存
  data.content = content
  fs.writeFileSync(filename, render(data))
}
