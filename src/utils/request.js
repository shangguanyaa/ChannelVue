import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
// import store from '@/store'
import {
  getToken,
  removeInfo,
  removeToken,
  setToken,
  setRefreshToken,
  removeRefreshToken,
  getRefreshToken
} from '../utils/auth'
import router from '@/router/index'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken()
    // }
    config.headers.Authorization = getToken()
    config.headers.refreshToken = getRefreshToken() || null
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 200) {
      const code = res.code
      if (code === 10101) {
        MessageBox.confirm('登录时间过期，或账号在别处登录，请重新登录哦', '登录时间过期', {
        }).then(() => {
          removeInfo()
          removeToken()
          removeRefreshToken()
          router.push({ path: '/Login' })
        })
        return
      }
      if (code === 10102) {
        Message({ message: '请先登录再使用该功能，如果已经登录，可能为账号已过期，或在别处登录，请重新登录使用哦~', type: 'Error' })
        removeInfo()
        removeToken()
        setTimeout(() => {
          router.push({ path: '/Login' })
        }, 1500)
        return
      }
      if (code === 201) {
        if (res && res.results) {
          const { token, refreshToken } = res.results
          setToken(token)
          setRefreshToken(refreshToken)
        }
        return res
      }
      Message({ message: res.message + ` 错误码: ${code}` || 'Error', type: 'error', duration: 5 * 1000 })
      return res
    } else {
      if (res.code === 200) {
        Notification({
          title: '操作成功',
          type: 'success',
          message: res.message
        })
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
