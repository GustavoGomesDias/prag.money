import UserModel from '../models/UserModel';

export default interface RegisterUser extends UserModel {
  passwordConfirmation: string
}

export interface AddUser {
  addUser(req: RegisterUser): Promise<Omit<UserModel, 'password'>>
}