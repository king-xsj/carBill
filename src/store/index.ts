/*
 * @Author: KJ
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: KJ
 * @LastEditTime: 2022/05/07 16:15:36
 */

import { createStore } from 'vuex'
import { store as app, AppState, AppStore } from '@/store/modules/app'
import { store as user, UserState, UserStore } from '@/store/modules/user'

export interface RootState {
  app: AppState
  permission: PermissionState
  user: UserState
}

export type Store = AppStore<Pick<RootState, 'app'>> & UserStore<Pick<RootState, 'user'>>

export const store = createStore<RootState>({
  modules: {
    app,
    user
  }
})

export function useStore(): Store {
  return store as Store
}
