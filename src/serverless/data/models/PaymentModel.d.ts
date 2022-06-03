/* eslint-disable semi */
export default interface PaymentModel {
  id?: number
  nickname: string
  default_value: number
  current_value?: number
  current_month: number
  reset_day: number
  user_id: number
}
