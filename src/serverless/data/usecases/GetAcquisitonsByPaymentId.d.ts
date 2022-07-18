import { ReturnsAcquisitions } from './GetAcquisitions';
import * as purchase from '../models/PurchaseModel';

export type GetPaymentInfos = Omit<ReturnsAcquisitions, 'acquisitions'>

export interface GetAcquisitionsByPaymentId extends GetPaymentInfos {
  purchases: purchase.PurchaseModelWithCreateData[]
}
