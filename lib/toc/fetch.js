/**
 * 获取 toc json
 */

const { getJSON, getId, debug } = require('../utils')

module.exports = async function (url) {
  // return Promise.resolve(url)
  let list
  if (Array.isArray(url)) {
    list = url
  } else {
    list = await getJSON(url)
  }
  const arr = list.map(iter)
  return Promise.all(arr)
}

async function iter(item) {
  const obj = {
    title: item.Title,
    href: item.Href,
    id: getId(item.Href)
  }

  if (item.ExtendedAttributes['data-tochassubtree'] === 'true') {
    debug(item)
    const data = await getJSON(item.Href + '?toc=1')
    const arr = data.map(iter)
    obj.children = await Promise.all(arr)
  }

  return obj
}
