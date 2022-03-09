/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchReturns<T> {
  statusCode: number
  data: T
}

export interface FetchAPIHeader {
  'Content-Type': string
  Accept: string
  Authorization?: string
}
