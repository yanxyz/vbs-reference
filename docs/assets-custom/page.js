/* global FILES */

// 点击页面链接时先检查本地是否已有目标页面
document.getElementById('content').addEventListener('click', function (event) {
  const el = event.target
  if (el.tagName !== 'A') return

  const id = getId(el.href)
  if (!id) return

  if (FILES.includes(id)) {
    const url = location.href.replace(/\w+(?=\.html)/, id)
    el.href = url
  }
})

document.addEventListener('keydown', function (e) {
  // `q` 返回首页
  if (e.keyCode === 81) {
    document.getElementById('link-index').click()
  }
})

function getId(href) {
  const match = href.match(/\/([a-z0-9]+)(\(v=vs\.\d+\))?\.aspx/)
  if (match) return match[1]
}
