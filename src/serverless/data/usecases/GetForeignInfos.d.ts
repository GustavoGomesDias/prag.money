/* eslint-disable semi */
import PaymentModel from '../models/PaymentModel';
import PurchaseModel from '../models/PurchaseModel';

export interface ReturnForeignInfos {
  Purchase: PurchaseModel[] | PurchaseModel
  Payment: PaymentModel[] | PaymentModel
}

export default interface GetForeignInfos {
  purchases: PurchaseModel[]
  payments: PaymentModel[]
}
