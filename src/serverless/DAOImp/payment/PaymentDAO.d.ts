/* eslint-disable semi */
import GenericDAO from '../../infra/DAO/GenericDAO';

export default interface PaymentDAO<C, R, U, D> extends GenericDAO<C, R, U, D> {
  checkIfPaymentExists(paymentId: number): Promise<boolean>
}
