const fetch = require('../../lib/toc/fetch')

fetch('https://msdn.microsoft.com/en-us/library/x75sb7ff(v=vs.84).aspx?toc=1')
  .then(toc => {
    console.log(toc)
  })
