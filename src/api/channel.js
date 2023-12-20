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
