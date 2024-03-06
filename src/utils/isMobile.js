
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

if (isMobile) {
  console.log('当前在手机端', true, document.documentElement.clientWidth)
  document.querySelector('html').style.fontSize = (100 * document.documentElement.clientWidth / 414) + 'px'
  console.log(document.querySelector('html').style.fontSize)
} else {
  console.log('当前在PC端', false)
}

module.exports = {
  isMobile,
  clientWidth: document.documentElement.clientWidth
}
