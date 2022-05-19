/* eslint-disable semi */
import ExtendGenericDAO from '../../infra/DAO/ExtendGenericDAO';
import { ReturnsAcquisitions } from '../../data/usecases/GetAcquisitions';

export default interface PaymentDAO<C, R, U, D, T> extends ExtendGenericDAO<C, R, U, D, T> {
  checkIfPaymentExists(paymentId: number): Promise<void>
  findByPaymentId(paymentId: number): Promise<ReturnsAcquisitions>
  findByPaymentIdWithPagination(paymentId: number, page: number): Promise<ReturnsAcquisitions>
}
