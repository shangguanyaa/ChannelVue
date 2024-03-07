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
