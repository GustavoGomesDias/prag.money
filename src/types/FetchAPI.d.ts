/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FetchReturns<T> {
  statusCode: number
  data: T
}

export interface HeaderPropertie {
  headerName: string
  content: string
}
