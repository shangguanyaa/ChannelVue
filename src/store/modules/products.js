import { ProductsList, bulkInsert, editProduct, destroyProducts, createProducts, ProductsListForIndex } from '@/api/products'

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
