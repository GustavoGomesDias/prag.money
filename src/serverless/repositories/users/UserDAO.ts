import UserModel from '../../data/models/UserModel';
import LoginProps from '../../data/usecases/Login';
import GenericDAO from '../../infra/DAO/GenericDAO';

export default interface UserDAO<C, R, U, D> extends GenericDAO<C, R, U, D> {
  findByEmail(info: string): Promise<Omit<UserModel, 'password'> | undefined>
}