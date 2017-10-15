const fetch = require('./fetch')
const transform = require('./transform')
const { writeFile, stringifyJSON, getJSON } = require('../utils')
const config = require('../config')

exports.fetch = async function (name) {
  if (!validate(name)) return

  let data

  if (name === 'msdn') {
    // JScript and VBScript
    const url = 'https://msdn.microsoft.com/en-us/library/d1et7k7c(v=vs.84).aspx?toc=1'
    const list = await getJSON(url)
    list.shift() // 忽略 jscript
    data = await fetch(list)
  }
  else if (name === 'technet') {
    // Scripting Guide
    const url = 'https://technet.microsoft.com/en-us/library/ee692931.aspx?toc=1'
    data = await fetch(url)
  }

  const siteConfig = config.sites[name]
  await writeFile(siteConfig.toc.json, stringifyJSON(data))
  await transform(data, siteConfig)
}

exports.transform = function (name) {
  if (!validate(name)) return

  const siteConfig = config.sites[name]
  const jsonFile = siteConfig.toc.json

  let toc
  try {
    toc = require(jsonFile)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Cannot find file '${jsonFile}'.`)
      console.error(`Run the command 'toc ${name}' to get it.`)
      return
    }
    throw err
  }

  return transform(toc, siteConfig).catch(err => console.error(err))
}

function validate(name) {
  const sites = Object.keys(config.sites)
  if (sites.includes(name)) return true
  console.error(`'${name}' is not supported.`)
  return false
}
