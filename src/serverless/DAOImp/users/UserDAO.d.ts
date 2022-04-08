/* eslint-disable semi */
import UserModel from '../../data/models/UserModel';
import GetForeignInfos from '../../data/usecases/GetForeignInfos';
import GenericDAO from '../../infra/DAO/GenericDAO';

export default interface UserDAO<C, R, U, D> extends GenericDAO<C, R, U, D> {
  findByEmail(info: string): Promise<UserModel | undefined>
  checkIfUserExists(userId: number): Promise<void>
  addUser(req: UserModel): Promise<Omit<UserModel, 'password'>>
  getAllForeignInfosByUserId(userId: number): Promise<GetForeignInfos | undefined>
}
