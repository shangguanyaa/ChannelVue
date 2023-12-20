import { ChannelList } from '@/api/channel'

const state = {}

const mutations = {}

const actions = {
  async getChannelList({ commit }, body) {
    const res = await ChannelList(body)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
