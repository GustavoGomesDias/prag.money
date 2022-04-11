import PaymentModel from '../models/PaymentModel';
import PayWithModel from '../models/PayWithModel';

/* eslint-disable semi */

export interface ReturnsAcquisitions extends PaymentModel {
  acquisitions: PayWithModel[]
}

export default interface GetAcquisitions extends PaymentModel {
  PayWith: PayWithModel[] | PayWithModel
}
