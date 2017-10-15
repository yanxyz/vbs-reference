const path = require('path')
const makeDir = require('make-dir')

const docs = path.join(__dirname, '../docs')

// 两个站点使用相同的 css，故不分成两个目录
const assets = path.join(docs, 'assets')
makeDir.sync(assets)

module.exports = {
  docs,
  assets,
  sites: {
    msdn: create('msdn'),
    technet: create('technet')
  }
}

function create(name) {
  const dir = path.join(docs, name, 'assets')
  makeDir.sync(dir)
  return {
    root: path.join(docs, name),
    toc: {
      json: path.join(dir, 'toc.json'),
      js: path.join(dir, 'toc.js'),
      global: 'TOC_' + name.toUpperCase()
    },
    files: {
      json: path.join(dir, 'files.json'),
      js: path.join(dir, 'files.js'),
      global: 'FILES'
    }
  }
}
