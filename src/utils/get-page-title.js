import defaultSettings from '@/settings'

const title = defaultSettings.title || '物流渠道比价系统(定制)'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
