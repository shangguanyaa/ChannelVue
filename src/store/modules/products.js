/*
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2025-03-03 17:17:30
 * @LastEditors: shangguanyaa 1051158791@qq.com
 * @LastEditTime: 2025-03-04 09:50:30
 * @FilePath: \ChannelVue\src\store\modules\products.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ProductsList, bulkInsert, editProduct, destroyProducts, createProducts, ProductsListForIndex, bulkUpdate } from '@/api/products'

const state = {}

const mutations = {}

const actions = {
  async getProductsList({ commit }, body) {
    const res = await ProductsList(body)
    return res
  },
  async getProductsListForIndex({ commit }, body) {
    const res = await ProductsListForIndex(body)
    return res
  },
  async bulkCreate({ commit }, body) {
    const res = await bulkInsert(body)
    return res
  },
  async bulkUpdate({ commit }, body) {
    const res = await bulkUpdate(body)
    return res
  },
  async updateProduct({ commit }, body) {
    const res = await editProduct(body)
    return res
  },
  async deleteProducts({ commit }, body) {
    const res = await destroyProducts(body)
    return res
  },
  async addProducts({ commit }, body) {
    const res = await createProducts(body)
    return res
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
