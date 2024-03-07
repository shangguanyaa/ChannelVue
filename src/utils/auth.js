const TokenKey = 'authorization-zl'
const InfoKey = 'user-info'

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function setRefreshToken(refreshToken) {
  return sessionStorage.setItem('refreshToken', refreshToken)
}

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function getRefreshToken() {
  return sessionStorage.getItem('refreshToken')
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function removeRefreshToken() {
  return sessionStorage.removeItem('refreshToken')
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
