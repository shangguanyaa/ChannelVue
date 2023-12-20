import request from '@/utils/request'

export function ChannelList(data) {
  return request({
    url: '/channel/conformList',
    method: 'post',
    data
  })
}
