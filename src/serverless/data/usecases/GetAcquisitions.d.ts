import PaymentModel from '../models/PaymentModel';
import PayWithModel from '../models/PayWithModel';

/* eslint-disable semi */

export interface ReturnsAcquisitions extends PaymentModel {
  acquisitions: PayWithModel[]
}

export interface ExtendedPayWithModel extends PayWithModel{
  purchase: {
    created_at: string
  }
}

export default interface GetAcquisitions extends PaymentModel {
  PayWith: ExtendedPayWithModel[] | ExtendedPayWithModel
}
