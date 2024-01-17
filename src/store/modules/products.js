import { ProductsList } from '@/api/products'

const state = {}

const mutations = {}

const actions = {
  async getProductsList({ commit }, body) {
    const res = await ProductsList(body)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
