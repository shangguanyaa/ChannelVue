import { ChannelList, AllChannelList } from '@/api/channel'

const state = {}

const mutations = {}

const actions = {
  async getChannelList({ commit }, body) {
    const res = await ChannelList(body)
    return res
  },
  async getAllChannelList({ commit }, body) {
    const res = await AllChannelList(body)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
