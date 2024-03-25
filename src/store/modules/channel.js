/*
 * @Author: SGuanyaa 1051158791@qq.com
 * @Date: 2024-03-19 14:43:02
 * @LastEditors: SGuanyaa 1051158791@qq.com
 * @LastEditTime: 2024-03-25 09:56:02
 * @FilePath: \ChannelVue\src\store\modules\channel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ChannelList, AllChannelList, ChannelTypes, updateAnChannel, addChannel, destroyChannels, bulkUpdateInsert, changeStatus } from '@/api/channel'

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
  },
  async getChannelTypes({ commit }, body) {
    const res = await ChannelTypes(body)
    return res
  },
  async updateChannel({ commit }, body) {
    const res = await updateAnChannel(body)
    return res
  },
  async insertChannel({ commit }, body) {
    const res = await addChannel(body)
    return res
  },
  async deleteChannels({ commit }, body) {
    const res = await destroyChannels(body)
    return res
  },
  async bulkInsertUpdate({ commit }, body) {
    const res = await bulkUpdateInsert(body)
    return res
  },
  async changeStatus({ commit }, body) {
    const res = await changeStatus(body)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
