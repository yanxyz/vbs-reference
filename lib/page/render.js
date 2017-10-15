/**
 * 模板
 */

const fs = require('fs')
const path = require('path')

const template = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8')

module.exports = function (data) {
  return template.replace(/{{([a-z]+)}}/g, (m, p) => {
    return data[p]
  })
}
