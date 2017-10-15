/* global TOC_MSDN TOC_TECHNET */

const listItems = []
generate()

/**
 * filter
 */

const $input = $('kw')
$input.addEventListener('input', function (e) {
  const kw = this.value.trim().toLowerCase()
  filter(kw)
})

document.addEventListener('keydown', function (e) {
  // `/` 定位搜索框
  if (e.keyCode === 191 && e.target.tagName.toLowerCase() !== 'input') {
    setTimeout(function () {
      $input.focus()
    }, 0)
  }
})

$('content').addEventListener('click', function (e) {
  const el = e.target
  if (el.tagName === 'I') {
    el.parentNode.classList.toggle('expanded')
  }
})

function filter(kw) {
  const className = 'filtering'
  if (!kw) {
    document.body.classList.remove(className)
    return
  }

  const list = listItems.filter(item => item.text.includes(kw)).map(li)
  $('list2').innerHTML = list.join('\n')

  document.body.classList.add(className)
}

function $(id) {
  return document.getElementById(id)
}

/**
 * 根据 TOC 生成列表
 */

function generate() {
  const html = section({
    title: 'msdn.microsoft.com',
    slug: 'msdn',
    toc: TOC_MSDN
  }).concat(section({
    title: 'technet.microsoft.com',
    slug: 'technet',
    toc: TOC_TECHNET
  }))

  $('content').innerHTML = html.join('\n')

  const arr = [
    'd1wf56tt',
    'hww8txat',
    'ee198690',
  ]
  arr.forEach(x => {
    const className = 'expanded'
    let li = document.querySelector(`li[data-id="${x}"]`)
    while (li.tagName === 'LI') {
      if (li.classList.contains(className)) break
      li.classList.add(className)
      li = li.parentElement.parentElement
    }
  })
}

function section(data) {
  const ul = []
  data.toc.forEach(iter)
  ul.unshift(`<h3>${data.title}</h3>`, '<ul class="list">')
  ul.push('</ul>')
  return ul

  function iter(item) {
    item.dir = data.slug
    if (item.children) {
      ul.push(`<li class="branch" data-id="${item.id}">
        <i class="triangle"></i>
        <a href="${item.dir}/${item.id}.html">${escapeHTML(item.title)}</a>`)
      ul.push('<ul>')
      item.children.forEach(iter)
      ul.push('</ul>')
      ul.push('</li>')
    } else {
      ul.push(li(item))
      item.text = item.title.toLowerCase()
      listItems.push(item)
    }
  }
}

function li(item) {
  return `<li class="item">
<a href="${item.dir}/${item.id}.html">${escapeHTML(item.title)}</a>
</li>`
}

function escapeHTML(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
