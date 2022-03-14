/* eslint-disable semi */
import PurchaseModel from '../models/Purchase';

export default interface AddPurchase extends PurchaseModel {
  paymentId: number;
}
