import request from '@/utils/request'

export class UserApi {
  doLogin(data) {
    return request.post('/users/login', data)
  }

  doAdminLogin(data) {
    return request.post('/admin/adminlogin', data)
  }

  doRegister(data) {
    return request.post('/users/register', data)
  }

  dotest(params) {
    return request.get('/users/test', params)
  }

  activation(params) {
    return request.get('/users/activation', { params })
  }

  sender(params) {
    return request.get('/users/sendEmail', { params })
  }
}
