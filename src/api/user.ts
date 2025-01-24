/*
 * @Author: KJ
 */

import axios from '@/utils/axios'

export const login = (data: any) => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    url: '/user/login',
    method: 'post',
    data
  })
}

export const userInfo = () => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    url: '/user/getUserByToken',
    method: 'get'
  })
}
