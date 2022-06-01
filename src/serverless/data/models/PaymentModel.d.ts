/* eslint-disable semi */
export default interface PaymentModel {
  id?: number
  nickname: string
  default_value: number
  additional_value?: number
  reset_day: number
  user_id: number
}
