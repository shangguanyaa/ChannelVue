import { MessageBox } from 'element-ui'

if (window.localStorage) {
  console.log('hasLocalStorage')
}

export function setOilMessageBox() {
  if (getOil() === null) {
    console.log('Oil is UnSet!')
    MessageBox.prompt('请先设置当周燃油价格', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputType: 'Number',
      inputValue: parseFloat(getOil())
    }).then(({ value }) => {
      window.localStorage.setItem('Oil', value)
    }).catch(() => {
      window.localStorage.setItem('Oil', 1)
      console.log('默认设置为1')
    })
  }
}

setOilMessageBox()

export function getOil() {
  const oil = window.localStorage.getItem('Oil')
  if (oil === null) {
    return 1
  }
  return parseFloat(oil)
}

// console.log(getOil())

