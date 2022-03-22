/* eslint-disable semi */
import PurchaseModel from '../models/PurchaseModel';

export type AddPayment = {
  paymentId: number
  value: number
}

export default interface AddPurchase extends PurchaseModel {
  payments: AddPayment[]
}
