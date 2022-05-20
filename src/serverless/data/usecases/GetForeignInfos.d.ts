/* eslint-disable semi */
import PurchaseModel from '../models/PurchaseModel';
import GetAcquisitions from './GetAcquisitions';

export interface ReturnForeignInfos {
  Purchase: PurchaseModel[] | PurchaseModel
  Payment: GetAcquisitions[] | GetAcquisitions
}

export default interface GetForeignInfos {
  purchases: PurchaseModel[]
  payments: GetAcquisitions[]
}
