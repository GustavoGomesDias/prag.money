/* eslint-disable semi */
import PaymentModel from '../../data/models/PaymentModel';
import UserModel from '../../data/models/UserModel';
import GenericDAO from '../../infra/DAO/GenericDAO';

export default interface UserDAO<C, R, U, D> extends GenericDAO<C, R, U, D> {
  findByEmail(info: string): Promise<UserModel | undefined>
  checkIfUserExists(userId: number): Promise<boolean>
  addUser(req: UserModel): Promise<Omit<UserModel, 'password'>>
  getAllPaymentByUserId(userId: number): Promise<PaymentModel[] | undefined>
}
