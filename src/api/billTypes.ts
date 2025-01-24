/*
 * @Author: KJ
 */

import axios from '@/utils/axios'

export const getBillTypes = () => {
  return axios.request<IResponseModel<any>>({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    url: '/bill/types',
    method: 'get'
  })
}
