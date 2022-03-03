import UserModel from '../../data/models/UserModel';
import GenericDAO from '../../infra/DAO/GenericDAO';

// @ts-ignore
export default interface UserDAO<C, R, U, D> extends GenericDAO<C, R, U, D> {
  findByEmail(info: string): Promise<UserModel | undefined>
}