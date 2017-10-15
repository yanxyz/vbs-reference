#!/usr/bin/env node

const argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {
    help: ['h']
  },
  boolean: ['help']
})

if (argv.help || argv._.length < 1) {
  showHelp()
}

const firstArg = argv._[0]
main(firstArg)

function main(sub) {
  if (sub === 'toc') {
    const site = argv._[1]
    if (!site) {
      console.error('Please specify the `site` argument')
      return
    }

    const toc = require('./lib/toc')
    if (argv.m) {
      toc.transform(site)
    } else {
      toc.fetch(site)
    }
    return
  }

  if (sub === 'css') {
    const css = require('./lib/css')
    if (argv.m) {
      css.modify()
    } else {
      css.fetch()
    }
    return
  }

  if (sub === 'page') {
    const site = argv._[1]
    if (!site) {
      console.error('Please specify the `site` argument')
      return
    }

    if (argv.m) {
      require('./lib/page/modify')(site)
      return
    }

    require('./lib/page/fetch')(site)
    return
  }

  if (sub === 'check') {
    require('./lib/page/check')()
    return
  }

  console.error('Unknown argment.')
  showHelp()
}

function showHelp() {
  const cmd = 'node ./cli.js'
  console.log(`
${cmd} toc <site> [options]
Fetch toc.json
-m Tranform toc.json to files.json

${cmd} css <options>
Fethc css
-m Modify stylesheets

${cmd} page <site> [options]
Fetch page
-m Modify the page

<site>: msdn | technet
`)

  process.exit()
}
