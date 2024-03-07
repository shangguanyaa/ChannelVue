import { UserApi } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const userApi = new UserApi()

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async doLogin({ commit }, body) {
    const res = await userApi.doLogin(body)
    return res
  },
  async doRegister({ commit }, body) {
    const res = await userApi.doRegister(body)
    return res
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

