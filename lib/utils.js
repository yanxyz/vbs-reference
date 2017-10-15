const fs = require('fs')
const { promisify, debuglog } = require('util')
const got = require('got')

exports.writeFile = promisify(fs.writeFile)

exports.stringifyJSON = function (data) {
  return JSON.stringify(data, null, 2)
}

exports.getJSON = function (url) {
  return got(url, {
    json: true
  }).then(res => res.body)
}

exports.debug = debuglog('vbs')

exports.getId = function (href) {
  const match = href.match(/\/([a-z0-9]+)(\(v=vs\.\d+\))?\.aspx/)
  if (!match) {
    throw new Error(`Cannot get id: ${href}`)
  }
  return match[1]
}

