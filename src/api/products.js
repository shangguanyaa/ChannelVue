import request from '@/utils/request'

export function ProductsList(data) {
  return request({
    url: '/product/getProductsList',
    method: 'post',
    data
  })
}

// export function AllChannelList(data) {
//   return request({
//     url: '/channel/getChannelList',
//     method: 'post',
//     data
//   })
// }

// export function ChannelTypes(data) {
//   return request({
//     url: '/channel/getChannelTypes',
//     method: 'post',
//     data
//   })
// }

// export function updateAnChannel(data) {
//   return request({
//     url: '/channel/updateAnChannel',
//     method: 'post',
//     data
//   })
// }

// export function addChannel(data) {
//   return request({
//     url: '/channel/addChannel',
//     method: 'post',
//     data
//   })
// }
