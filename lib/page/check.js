/**
 * 检查是否有遗漏没有下载的页面
 */

const fs = require('fs')
const config = require('../config')

module.exports = function () {
  for (const [site, siteConfig] of Object.entries(config.sites)) {
    const a = fs.readdirSync(siteConfig.root)
      .filter(x => x.endsWith('.html'))
      .map(x => x.slice(0, -5))
    const b = require(siteConfig.files.json).map(x => x.id)
    console.log(site)
    console.log('local  - online', a.filter(x => !b.includes(x)))
    console.log('online - local ', b.filter(x => !a.includes(x)))
  }
}
