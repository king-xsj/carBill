/*
 * @Author: KJ
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: KJ
 * @LastEditTime: 2023/04/13 18:39:25
 */

import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { useStore } from '@/store'
import { UserActionTypes } from '@/store/modules/user/types'
import { showToast } from '@/utils'
import buildURL from 'axios/lib/helpers/buildURL'

function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response)
  } else {
    reject({ response })
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    token?: boolean
  }
}

axios.defaults.adapter = function (config: any) {
  return new Promise((resolve, reject) => {
    uni.request({
      method: config.method.toUpperCase(),
      url: config.baseURL + buildURL(config.url, config.params, config.paramsSerializer),
      header: config.headers,
      data: config.data,
      dataType: config.dataType,
      responseType: config.responseType,
      sslVerify: config.sslVerify,
      complete: function complete(response: any) {
        response = {
          data: response.data,
          status: response.statusCode,
          errMsg: response.errMsg,
          header: response.header,
          config: config
        }

        settle(resolve, reject, response)
      }
    })
  })
}

export class Request {
  private axiosInstance: AxiosInstance
  private options: AxiosRequestConfig

  constructor(options: AxiosRequestConfig) {
    this.options = options
    // 创建axios实例
    this.axiosInstance = axios.create(options)
    this.setupInterceptors()
  }

  getAxios(): AxiosInstance {
    return this.axiosInstance
  }

  // 设置header
  setHeader(headers: any): void {
    if (!this.axiosInstance) return
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  // 拦截器配置
  private setupInterceptors() {
    // 请求拦截器配置处理
    this.axiosInstance.interceptors.request.use(
      (request: AxiosRequestConfig) => {
        const store = useStore()
        console.log(store.state.user.token)
        const token =
          'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI2ZDg1NmM3YjBjNzc0NDViOGY2ZDQwOTUwMjM5NWMxNiIsInN1YiI6IjEiLCJpc3MiOiJ6aGl5aSIsImlhdCI6MTc0MzE0MDkwOCwiZXhwIjoxNzQ0NDM2OTA4fQ.T5vk7kaOj7ZskufcPMxZ-ATp2b_0C8JS-iNDP3mLAGk'
        const hasToken = typeof request.token !== 'undefined'
        if (!hasToken) {
          if (token) request.headers['Token'] = token
        } else {
          if (request.token) request.headers['Token'] = token
        }

        return request
      },
      (e: AxiosError) => {
        Promise.reject(e)
      }
    )

    // 响应结果拦截器处理
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        const { code, msg } = response.data
        if (code === 200) {
          return response
        } else {
          showToast(msg || '服务器响应失败，请重试')
          return Promise.reject(response)
        }
      },
      (e: AxiosError) => {
        const { response } = e
        const { status } = response as AxiosResponse
        const store = useStore()
        if (status === 500) {
          showToast('登录已失效，请重新登录')
          store.dispatch(UserActionTypes.ACTION_RESET_TOKEN, undefined).then(() => {
            uni.navigateTo({
              url: '/pages/login/login'
            })
          })
        }
        if (status === 502) {
          showToast('服务器响应失败，请重试')
        }
        return Promise.reject(e)
      }
    )
  }

  // 发送请求
  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(config)
        .then((res: AxiosResponse<IResponseModel<any>>) => {
          resolve(res.data as unknown as Promise<T>)
        })
        .catch((e: Error) => {
          reject(e)
        })
    })
  }
}
