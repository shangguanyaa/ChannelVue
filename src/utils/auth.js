import Cookies from 'js-cookie'

const TokenKey = 'authorization-zl'
const InfoKey = 'user-info'

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setRefreshToken(refreshToken) {
  return Cookies.set('refreshToken', refreshToken)
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getRefreshToken() {
  return Cookies.get('refreshToken')
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove('refreshToken')
}

// 用户信息相关
export function setInfo(info) {
  return localStorage.setItem(InfoKey, JSON.stringify(info))
}

export function getInfo() {
  return JSON.parse(localStorage.getItem(InfoKey))
}

export function removeInfo() {
  return localStorage.removeItem(InfoKey)
}

export function isAdmin() {
  const userinfo = getInfo()
  console.log(userinfo)
  const key = 'power'
  if (Object.prototype.hasOwnProperty.call(userinfo, key)) {
    console.log('当前身份: 管理员')
    return true
  } else {
    console.log('当前身份: 普通用户')
    return false
  }
}
