/**
 * 将 TOC 转为 FILES
 */

const { writeFile, stringifyJSON } = require('../utils')

module.exports = async function transform(toc, config) {
  // 将 toc.json 转为 toc.js，供 index.html 使用
  await writeFile(config.toc.js, `var ${config.toc.global} = ${stringifyJSON(toc)}`)

  // 将 toc.json 转为 files.json，供下载使用
  const files = []
  iter(toc)
  await writeFile(config.files.json, stringifyJSON(files))

  // 将 files.json 转为 files.js（提取 id），供页面使用
  await writeFile(config.files.js, `var ${config.files.global} = ${stringifyJSON(files.map(x => x.id))}`)

  function iter(arr) {
    arr.forEach(x => {
      if (x.children) {
        files.push({
          title: x.title,
          href: x.href,
          id: x.id
        })
        iter(x.children)
      } else {
        files.push(x)
      }
    })
  }
}
