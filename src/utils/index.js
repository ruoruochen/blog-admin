import { get } from './storage'

// =========  获取 JWT   =========
export function getToken() {
  let token = ''
  const userInfo = get('userInfo')
  if (userInfo && userInfo.token) {
    token = 'Bearer ' + userInfo.token
  }
  return token
}
