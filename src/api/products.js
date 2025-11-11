/*
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2025-03-03 17:17:30
 * @LastEditors: SGuanyaa 1051158791@qq.com
 * @LastEditTime: 2025-11-11 14:01:46
 * @FilePath: \ChannelVue\src\api\products.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function ProductsList(data) {
  return request({
    url: '/product/getProductsList',
    method: 'post',
    data
  })
}

export function ProductsListForIndex(data) {
  return request({
    url: '/product/ProductsListForIndex',
    method: 'post',
    data
  })
}

export function bulkInsert(data) {
  return request({
    url: '/product/bulkInsert',
    method: 'post',
    data
  })
}

export function bulkUpdate(data) {
  return request({
    url: '/product/bulkUpdate',
    method: 'post',
    data
  })
}

export function editProduct(data) {
  return request({
    url: '/product/editProduct',
    method: 'post',
    data
  })
}

export function destroyProducts(data) {
  return request({
    url: '/product/deleteProducts',
    method: 'post',
    data
  })
}

export function createProducts(data) {
  return request({
    url: '/product/addProduct',
    method: 'post',
    data
  })
}

/**
 * @description: 根据 stockSKU 数组删除产品
 * @param {array} data
 * @return {*}
 */
export function deleteByStockSKU(data) {
  return request({
    url: '/product/batchDeleteByStockSKU',
    method: 'post',
    data
  })
}

