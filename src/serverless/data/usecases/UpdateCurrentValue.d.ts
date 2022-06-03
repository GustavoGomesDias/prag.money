/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-extra-semi */
export default interface UpdateCurrentPurchase {
  PayWith: {
    value: number
    payment_id: number
  }[]
}
