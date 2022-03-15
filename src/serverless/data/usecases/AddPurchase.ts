/* eslint-disable semi */
import PurchaseModel from '../models/PurchaseModel';

export default interface AddPurchase extends PurchaseModel {
  paymentId: number;
}
