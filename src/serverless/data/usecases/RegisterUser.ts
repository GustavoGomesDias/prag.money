import UserModel from '../models/UserModel';

export default interface RegisterUser extends UserModel {
  passwordConfirmation: string
}