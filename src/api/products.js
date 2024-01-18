import request from '@/utils/request'

export function ProductsList(data) {
  return request({
    url: '/product/getProductsList',
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

