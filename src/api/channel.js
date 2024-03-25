/*
 * @Author: SGuanyaa 1051158791@qq.com
 * @Date: 2024-03-19 14:43:02
 * @LastEditors: SGuanyaa 1051158791@qq.com
 * @LastEditTime: 2024-03-25 09:55:15
 * @FilePath: \ChannelVue\src\api\channel.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/utils/request'

export function ChannelList(data) {
  return request({
    url: '/channel/conformList',
    method: 'post',
    data
  })
}

export function AllChannelList(data) {
  return request({
    url: '/channel/getChannelList',
    method: 'post',
    data
  })
}

export function ChannelTypes(data) {
  return request({
    url: '/channel/getChannelTypes',
    method: 'post',
    data
  })
}

export function updateAnChannel(data) {
  return request({
    url: '/channel/updateAnChannel',
    method: 'post',
    data
  })
}

export function addChannel(data) {
  return request({
    url: '/channel/addChannel',
    method: 'post',
    data
  })
}

export function destroyChannels(data) {
  return request({
    url: '/channel/deleteChannels',
    method: 'post',
    data
  })
}

export function bulkUpdateInsert(data) {
  return request({
    url: '/channel/ChannelBulkInsert',
    method: 'post',
    data
  })
}

export function changeStatus(data) {
  return request({
    url: '/channel/StatusChange',
    method: 'post',
    data
  })
}
