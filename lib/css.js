const fs = require('fs')
const path = require('path')
const got = require('got')
const config = require('./config')
const { writeFile } = require('./utils')

// 保留 css 源文件，作为存档
const cssFile = path.join(config.assets, 'combined.msdn.css')

/**
 * exports
 */

exports.fetch = fetch

exports.modify = function () {
  const source = fs.readFileSync(cssFile, 'utf8')
  modify(source)
}

/**
 * 下载并修改 css 文
 */

async function fetch() {
  // combined.css 的地址很长，所以从页面中提取
  const url = 'https://msdn.microsoft.com/en-us/library/t0aew7h6(v=vs.84).aspx'
  const html = await getSource(url)
  const match = html.match(/type="text\/css" href="(https:\/\/i-msdn[^"]+)"/)
  if (!match) {
    throw new Error('Cannot get the href of stylesheet.')
  }
  const href = match[1]

  const source = await getSource(href)
  await writeFile(cssFile, source)
  modify(source)

  // 下载图片
  const imgs = [
    {
      url: 'https://i-msdn.sec.s-msft.com/Areas/Library/Content/ImageSprite.png',
      name: 'ImageSprite.png'
    },
    {
      url: 'https://i-msdn.sec.s-msft.com/Areas/Epx/Content/Images/ImageSprite.png',
      name: 'EpxImageSprite.png'
    }
  ]
  await Promise.all(imgs.map(download))
}

function getSource(url) {
  return got(url).then(res => res.body)
}

function download({ url, name }) {
  got.stream(url).pipe(fs.createWriteStream(path.join(config.assets, name)))
}

function modify(source) {
  const content = source
    .replace(re('/Areas/Library/Content/'), '')
    .replace(re('/Areas/Epx/Content/Images/ImageSprite.png'), 'EpxImageSprite.png')

  fs.writeFileSync(path.join(config.assets, 'combined.css'), content)
}

function re(str) {
  return new RegExp(str.replace(/[.]/g, '\\$&'), 'g')
}
