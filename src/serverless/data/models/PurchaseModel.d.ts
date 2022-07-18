/* eslint-disable semi */
export default interface PurchaseModel {
  id?: number
  value: number
  description: string
  purchase_date: Date
  user_id: number
}

export interface PurchaseModelWithCreateData extends PurchaseModel {
  created_at: string
}
