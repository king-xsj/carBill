//declare import module
declare module '*/**'
declare module '*'

declare interface IResponseModel<T> {
  code: number
  msg: string
  data?: T
}

declare interface IObjModel {
  [propName: string]: any
}

declare type Recordable<T = any> = Record<string, T>

declare let getCurrentPages: any
declare let uni: any
declare let wx: any
