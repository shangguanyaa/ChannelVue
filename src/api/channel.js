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
