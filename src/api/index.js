import axios from 'axios'
import local from '@/utils/local'
import router from '@/router'
import JSONBIG from 'json-bigint'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 在响应的时候对后台传过来的id进行格式转换
axios.defaults.transformResponse = [data => {
  try {
    return JSONBIG.parse(data)
  } catch (e) {
    return data
  }
}]
// 添加请求拦截器
axios.interceptors.request.use((config) => {
  // 在发送请求之前获取token 并设置请求头
  const user = local.getUser() || {}
  config.headers.Authorization = `Bearer ${user.token}`
  return config
}, (err) => {
  return Promise.reject(err)
})

// 添加响应拦截器
axios.interceptors.response.use(res => res, err => {
  // 对响应错误做点什么
  if (err.response.status === 401) {
    // 如果是401就跳转
    router.push('/login')
  }
  return Promise.reject(err)
})

export default axios
