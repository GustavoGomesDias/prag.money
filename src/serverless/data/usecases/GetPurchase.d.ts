/* eslint-disable semi */
import PaymentModel from '../models/PaymentModel';
import PurchaseModel from '../models/PurchaseModel';

export default interface GetPurchase extends PurchaseModel {
  PayWith: {
    payment: PaymentModel,
    value: number
    id?: number
   }[]
}
