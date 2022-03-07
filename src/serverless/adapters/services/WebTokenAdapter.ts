import UserModel from '../../data/models/UserModel';

export default interface WebTokenAdapter {
  sign(payload: Omit<UserModel, 'password'>, expiresIn: string | number): string
  verify(token: string): Omit<UserModel, 'password'>

};
