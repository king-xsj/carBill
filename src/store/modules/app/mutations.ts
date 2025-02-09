/*
 * @Author: KJ
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: KJ
 * @LastEditTime: 2022/05/18 23:15:05
 */

import { MutationTree } from 'vuex'
import { AppState, DeviceType } from './state'
import { AppMutationTypes } from './types'

export type Mutations<S = AppState> = {
  [AppMutationTypes.TOGGLE_DEVICE](state: S, device: DeviceType): void
}

export const mutations: MutationTree<AppState> & Mutations = {
  [AppMutationTypes.TOGGLE_DEVICE](state: AppState, device: DeviceType) {
    state.device = device
  },
  [AppMutationTypes.SET_STATE](state: AppState, payload: any) {
    Object.keys(payload).forEach(key => {
      state[key] = payload[key]
    })
  }
}
